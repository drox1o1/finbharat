<?php
// Explicit local demo import, independent of plugin activation and production seeds.
if (!defined('WP_CLI') || !WP_CLI || home_url() !== 'http://localhost:8088') {
    throw new RuntimeException('Sample blogs may be imported only into the localhost:8088 demo.');
}
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
$editor = get_user_by('login', 'local-editor');
if (!$editor) { throw new RuntimeException('Local Editor account is required.'); }
wp_set_current_user($editor->ID);
wp_update_user(['ID' => $editor->ID, 'display_name' => 'Finbharat editorial']);
$directory = '/opt/finbharat-samples';
$articles = json_decode(file_get_contents($directory . '/articles.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($articles as $article) {
    $existing = get_posts(['post_type' => 'post', 'post_status' => 'any', 'name' => $article['slug'], 'numberposts' => 1]);
    if ($existing) { echo 'Already imported; preserving editorial edits: ' . $article['title'] . "\n"; continue; }
    $category = term_exists($article['category'], 'category');
    if (!$category) { $category = wp_insert_term($article['category'], 'category'); }
    if (is_wp_error($category)) { throw new RuntimeException($category->get_error_message()); }
    $request = new WP_REST_Request('POST', '/wp/v2/posts');
    $request->set_body_params([
        'status' => 'draft', 'slug' => $article['slug'], 'title' => $article['title'],
        'excerpt' => $article['excerpt'], 'content' => file_get_contents($directory . '/' . $article['body']),
        'categories' => [(int)$category['term_id']],
        'meta' => ['_fb_seo' => ['title' => $article['title'] . ' | Finbharat', 'description' => $article['seoDescription']]],
    ]);
    $response = rest_do_request($request);
    if ($response->get_status() !== 201) { throw new RuntimeException(wp_json_encode($response->get_data())); }
    $id = $response->get_data()['id'];
    $temporary = wp_tempnam($article['image']);
    if (!copy('/opt/finbharat-editorial/' . $article['image'], $temporary)) { throw new RuntimeException('Could not stage cover image.'); }
    $attachment = media_handle_sideload(['name' => $article['image'], 'tmp_name' => $temporary], $id, $article['imageAlt']);
    if (is_wp_error($attachment)) { @unlink($temporary); throw new RuntimeException($attachment->get_error_message()); }
    update_post_meta($attachment, '_wp_attachment_image_alt', $article['imageAlt']);
    update_post_meta($id, '_fb_sample_article', true);
    $publish = new WP_REST_Request('POST', '/wp/v2/posts/' . $id);
    $publish->set_body_params(['status' => 'publish', 'featured_media' => $attachment]);
    $response = rest_do_request($publish);
    if ($response->get_status() !== 200) { throw new RuntimeException(wp_json_encode($response->get_data())); }
    echo 'Published local sample #' . $id . ': ' . $article['title'] . "\n";
}
