<?php
/** Restore the supplied public editorial snapshot using WP-CLI. */
if (!defined('WP_CLI') || !WP_CLI || !class_exists('Finbharat_Content')) {
    throw new RuntimeException('Run with WP-CLI after activating the Finbharat Content plugin.');
}
[$manifest, $asset_directory, $mode] = array_pad($args ?? [], 3, 'preview');
if (!in_array($mode, ['preview', 'import', 'replace'], true)) { WP_CLI::error('Mode must be preview, import or replace.'); }
if (!is_readable($manifest) || !is_dir($asset_directory)) { WP_CLI::error('Supply the content JSON and website/public directory.'); }
$content = json_decode(file_get_contents($manifest), true, 512, JSON_THROW_ON_ERROR);
if (($content['schemaVersion'] ?? null) !== 1 || empty($content['pages']) || empty($content['site'])) { WP_CLI::error('Invalid content snapshot.'); }
$asset_root = realpath($asset_directory) . DIRECTORY_SEPARATOR;
$seed = Finbharat_Content::seed();
$jobs = [];
foreach ($content['pages'] as $route => $page) {
    if (!isset($seed['pages'][$route])) { WP_CLI::error('Unknown page template: ' . $route); }
    $existing = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => $route, 'numberposts' => 1]);
    $id = $existing ? $existing[0]->ID : 0;
    $is_seed = $id && get_post_meta($id, '_fb_fields', true) == Finbharat_Content::clean($seed['pages'][$route]['fields']);
    $jobs[] = ['type' => 'fb_page', 'key' => $route, 'id' => $id, 'skip' => $id && !$is_seed && $mode !== 'replace', 'data' => $page];
}
foreach (['blog' => 'post', 'media' => 'finbharat_media', 'caseStudies' => 'finbharat_case'] as $kind => $type) {
    foreach ($content[$kind] ?? [] as $article) {
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $article['slug'])) { WP_CLI::error('Invalid article slug.'); }
        $existing = get_posts(['post_type' => $type, 'post_status' => 'any', 'name' => $article['slug'], 'numberposts' => 1]);
        $id = $existing ? $existing[0]->ID : 0;
        $image = $article['image'] ?? '';
        if ($image) {
            $path = realpath($asset_root . ltrim($image, '/'));
            if (!$path || !str_starts_with($path, $asset_root) || !is_file($path)) { WP_CLI::error('Missing bundled image for ' . $article['slug']); }
        }
        $seed_article = null;
        foreach ($seed[$kind] ?? [] as $candidate) { if ($candidate['slug'] === $article['slug']) { $seed_article = $candidate; break; } }
        $is_seed = $id && $seed_article && !get_post_meta($id, '_fb_handover_key', true)
            && trim($existing[0]->post_content) === trim(wp_kses_post($seed_article['html']))
            && $existing[0]->post_title === $seed_article['title'];
        $jobs[] = ['type' => $type, 'key' => $article['slug'], 'id' => $id, 'skip' => $id && !$is_seed && $mode !== 'replace', 'data' => $article];
    }
}
foreach ($jobs as $job) { WP_CLI::log(($job['skip'] ? 'Preserve' : ($job['id'] ? 'Update' : 'Create')) . ' ' . $job['type'] . ' ' . $job['key']); }
if ($mode === 'preview') { WP_CLI::success('Preview only. No content or settings changed. Use import for a new installation; replace only after backing up an existing site.'); return; }
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
foreach ($jobs as $job) {
    if ($job['skip']) { continue; }
    $data = $job['data'];
    $page = $job['type'] === 'fb_page';
    $post = ['post_type' => $job['type'], 'post_title' => $data['title'], 'post_status' => $page && empty($data['approved']) ? 'draft' : 'publish'];
    if ($job['id']) { $post['ID'] = $job['id']; }
    if (!$page) {
        $post['post_name'] = $data['slug']; $post['post_content'] = wp_kses_post($data['html']); $post['post_excerpt'] = $data['excerpt'];
        if (!empty($data['date'])) {
            $timestamp = strtotime($data['date']);
            if ($timestamp === false) { WP_CLI::error('Invalid publication date.'); }
            $post['post_date_gmt'] = gmdate('Y-m-d H:i:s', $timestamp);
            $post['post_date'] = get_date_from_gmt($post['post_date_gmt']);
        }
    }
    $id = wp_insert_post(wp_slash($post), true);
    if (is_wp_error($id)) { WP_CLI::error($id->get_error_message()); }
    update_post_meta($id, '_fb_seo', $data['seo']);
    if ($page) {
        update_post_meta($id, '_fb_route', $job['key']); update_post_meta($id, '_fb_fields', $data['fields']); update_post_meta($id, '_fb_approved', !empty($data['approved']));
    } else {
        if ($job['type'] === 'post') {
            $categories = [];
            foreach ($data['categories'] ?? [] as $name) {
                $term = term_exists($name, 'category'); if (!$term) { $term = wp_insert_term($name, 'category'); }
                if (is_wp_error($term)) { WP_CLI::error($term->get_error_message()); }
                $categories[] = (int)$term['term_id'];
            }
            if ($categories) { wp_set_post_categories($id, $categories); }
        } elseif ($job['type'] === 'finbharat_case') {
            update_post_meta($id, '_fb_fields', $data['fields']);
        } else {
            $fields = array_intersect_key($data, array_flip(['mediaType', 'source', 'sourceLabel', 'image', 'imageAlt', 'imageCredit', 'video', 'captions', 'transcript']));
            update_post_meta($id, '_fb_fields', $fields);
        }
        if (!empty($data['image'])) {
            $temporary = wp_tempnam(basename($data['image']));
            if (!copy($asset_root . ltrim($data['image'], '/'), $temporary)) { WP_CLI::error('Could not stage image.'); }
            $attachment = media_handle_sideload(['name' => basename($data['image']), 'tmp_name' => $temporary], $id, $data['imageAlt'] ?? '');
            if (is_wp_error($attachment)) { @unlink($temporary); WP_CLI::error($attachment->get_error_message()); }
            update_post_meta($attachment, '_wp_attachment_image_alt', $data['imageAlt'] ?? ''); set_post_thumbnail($id, $attachment);
        }
    }
    update_post_meta($id, '_fb_handover_key', $job['key']);
}
// Preserve edited shared settings on reruns unless replacement was explicitly requested.
if (!get_option('fb_handover_imported') || $mode === 'replace') {
    update_option('fb_site', $content['site'], false); update_option('fb_scenarios', $content['scenarios'] ?? [], false);
}
update_option('fb_handover_imported', true, false);
flush_rewrite_rules();
WP_CLI::success('Content restored. Create client accounts separately and configure the new CMS origin, backups, scheduled tasks and deploy hook.');
