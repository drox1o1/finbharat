<?php
// Disposable local fixtures, never real editorial content or an approved introduction.
if (!defined('WP_CLI') || !WP_CLI || !str_contains(home_url(), 'localhost:8088')) { throw new RuntimeException('Use only the disposable localhost:8088 installation.'); }
$mode = $args[0] ?? '';
if ($mode === 'cleanup') {
    $backup = get_option('fb_qa_backup');
    if (!$backup) { echo "No fixtures to remove.\n"; return; }
    foreach ($backup['posts'] as $id) { wp_delete_post($id, true); }
    update_option('fb_site', $backup['site']);
    foreach ($backup['pages'] as $id => $page) {
        wp_update_post(['ID' => $id, 'post_status' => $page['status']]);
        update_post_meta($id, '_fb_fields', $page['fields']);
        update_post_meta($id, '_fb_approved', $page['approved']);
    }
    foreach ($backup['cases'] ?? [] as $id => $case) { wp_update_post(['ID' => $id, 'post_excerpt' => $case['excerpt']]); update_post_meta($id, '_fb_fields', $case['fields']); }
    delete_option('fb_qa_backup');
    echo "Local editorial fixtures removed.\n"; return;
}
if ($mode !== 'create' || get_option('fb_qa_backup')) { throw new RuntimeException('Specify create or cleanup; clean old fixtures first.'); }
$backup = ['site' => get_option('fb_site'), 'posts' => [], 'pages' => []];
update_option('fb_qa_backup', $backup, false);
foreach (['post' => 'blog', 'finbharat_media' => 'media'] as $type => $kind) {
    $id = wp_insert_post(['post_type' => $type, 'post_status' => 'publish', 'post_title' => 'Local QA ' . $kind . ' — not an actual publication', 'post_name' => 'local-qa-' . $kind, 'post_excerpt' => 'A clearly labelled disposable test article.', 'post_content' => '<h2>Local verification content</h2><p>Only used to test editorial publishing.</p><ul><li>Headings and lists</li><li>Safe links</li></ul><blockquote><p>A local fixture quotation.</p></blockquote><p><a href="/calculators/fd/">Explore the FD calculator</a></p>']);
    $backup['posts'][] = $id;
    if ($kind === 'media') { update_post_meta($id, '_fb_fields', ['mediaType' => 'press', 'source' => 'https://www.sebi.gov.in/']); }
    update_option('fb_qa_backup', $backup, false);
}
$id = wp_insert_post(['post_type' => 'post', 'post_status' => 'draft', 'post_title' => 'Local QA excluded draft', 'post_name' => 'local-qa-draft']);
$backup['posts'][] = $id;
foreach (['/', '/mutual-funds/', '/terms/'] as $route) {
    $page = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => $route, 'numberposts' => 1])[0];
    $fields = get_post_meta($page->ID, '_fb_fields', true);
    $backup['pages'][$page->ID] = ['fields' => $fields, 'status' => $page->post_status, 'approved' => get_post_meta($page->ID, '_fb_approved', true)];
    if ($route === '/') { $fields['heroTitle'] = 'Local QA homepage.'; }
    if ($route === '/mutual-funds/') { $fields['product']['faqs'][] = ['Local QA FAQ?', 'A disposable answer for browser verification.']; }
    if ($route === '/terms/') { $fields['body'] = '<h2>Local QA legal page</h2><p>Disposable test text, not approved legal terms.</p>'; wp_update_post(['ID' => $page->ID, 'post_status' => 'publish']); }
    update_post_meta($page->ID, '_fb_fields', $fields);
}
$case = get_posts(['post_type' => 'finbharat_case', 'post_status' => 'publish', 'name' => 'srijan-financial-independence', 'numberposts' => 1])[0];
$fields = get_post_meta($case->ID, '_fb_fields', true);
$backup['cases'][$case->ID] = ['excerpt' => $case->post_excerpt, 'fields' => $fields];
update_option('fb_qa_backup', $backup, false);
$fields['fd']['principal'] = '300000';
wp_set_current_user(get_user_by('login', 'local-editor')->ID);
$request = new WP_REST_Request('POST', '/wp/v2/finbharat_case/' . $case->ID);
$request->set_body_params(['excerpt' => 'Local QA edited fictional planning story.', 'meta' => ['_fb_fields' => $fields]]);
if (rest_do_request($request)->get_status() !== 200) { throw new RuntimeException('Case editor update failed.'); }
$site = $backup['site'];
$site['intro'] = ['approved' => true, 'title' => 'Local QA dialog: not a product introduction', 'video' => '/video/hero-scroll-from-1s.mp4', 'poster' => '/video/hero-poster-1s.jpg', 'captions' => '/video/local-qa.vtt', 'transcript' => 'A decorative landscape used only for local dialog testing.'];
update_option('fb_site', $site);
update_option('fb_qa_backup', $backup, false);
echo "Local editorial and dialog fixtures created.\n";
