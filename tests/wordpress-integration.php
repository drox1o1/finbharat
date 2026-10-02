<?php
// Runs only through WP-CLI against the disposable local integration installation.
if (!defined('WP_CLI') || !WP_CLI) { exit; }
function fb_assert($value, $message) { if (!$value) { throw new RuntimeException($message); } }
$created = [];
$original_hook = get_option('fb_build_hook', '');
$original_site = get_option('fb_site');
$original_scenarios = get_option('fb_scenarios');
$home = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => '/', 'numberposts' => 1])[0];
$original_fields = get_post_meta($home->ID, '_fb_fields', true);
$mutual = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => '/mutual-funds/', 'numberposts' => 1])[0];
$original_faq = get_post_meta($mutual->ID, '_fb_fields', true);
$terms = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => '/terms/', 'numberposts' => 1])[0];
$original_terms = get_post_meta($terms->ID, '_fb_fields', true);
$hook_calls = 0;
$hook_code = 202;
add_filter('pre_http_request', function($pre, $args, $url) use (&$hook_calls, &$hook_code) {
    if (str_starts_with($url, 'https://api.netlify.com/build_hooks/')) { $hook_calls++; return ['headers' => [], 'body' => '{}', 'response' => ['code' => $hook_code, 'message' => 'Test accepted'], 'cookies' => [], 'filename' => null]; }
    return $pre;
}, 10, 3);
try {
    wp_set_current_user(get_user_by('login', 'local-editor')->ID);
    fb_assert(current_user_can('edit_pages') && !current_user_can('manage_options'), 'Editor permissions are incorrect.');
    $fields = $original_fields; $fields['heroTitle'] = 'Integration fixture: revised homepage';
    $request = new WP_REST_Request('POST', '/wp/v2/fb_page/' . $home->ID);
    $request->set_body_params(['meta' => ['_fb_fields' => $fields]]);
    $response = rest_do_request($request);
    fb_assert($response->get_status() === 200, 'Editor cannot update a fixed website template through WordPress.');
    $public = rest_do_request(new WP_REST_Request('GET', '/finbharat/v1/site'))->get_data();
    fb_assert($public['pages']['/']['fields']['heroTitle'] === $fields['heroTitle'], 'Updated homepage is absent from the public content response.');
    $faq = $original_faq; $faq['product']['faqs'][] = ['Integration fixture question?', 'An integration fixture answer.'];
    $request = new WP_REST_Request('POST', '/wp/v2/fb_page/' . $mutual->ID); $request->set_body_params(['meta' => ['_fb_fields' => $faq]]);
    fb_assert(rest_do_request($request)->get_status() === 200, 'Editor cannot update a FAQ.');
    $legal = $original_terms; $legal['body'] = '<h2>Integration fixture terms</h2><p>Not approved legal wording.</p>';
    $request = new WP_REST_Request('POST', '/wp/v2/fb_page/' . $terms->ID); $request->set_body_params(['meta' => ['_fb_fields' => $legal]]);
    fb_assert(rest_do_request($request)->get_status() === 200 && get_post_meta($terms->ID, '_fb_fields', true)['body'] === $legal['body'], 'Editor cannot edit a legal page.');
    $revisions = wp_get_post_revisions($home->ID);
    fb_assert(count($revisions) >= 1, 'Fixed page content revisions not retained.');
    $post = wp_insert_post(['post_type' => 'post', 'post_status' => 'draft', 'post_title' => 'Integration fixture blog', 'post_name' => 'integration-fixture-blog', 'post_content' => '<h2>A fixture heading</h2><p>Local test content.</p>', 'post_excerpt' => 'A clearly labelled local integration fixture.', 'post_author' => get_current_user_id()]); $created[] = $post;
    wp_update_post(['ID' => $post, 'post_status' => 'publish']);
    $result = rest_do_request(new WP_REST_Request('GET', '/wp/v2/posts'))->get_data();
    fb_assert(in_array('integration-fixture-blog', array_column($result, 'slug'), true), 'Published blog missing.');
    wp_update_post(['ID' => $post, 'post_status' => 'draft']);
    $result = rest_do_request(new WP_REST_Request('GET', '/wp/v2/posts'))->get_data();
    fb_assert(!in_array('integration-fixture-blog', array_column($result, 'slug'), true), 'Unpublished blog still public.');
    $scheduled = wp_insert_post(['post_type' => 'post', 'post_status' => 'future', 'post_title' => 'Scheduled integration fixture', 'post_name' => 'scheduled-integration-fixture', 'post_date' => gmdate('Y-m-d H:i:s', time() + 3600), 'post_date_gmt' => gmdate('Y-m-d H:i:s', time() + 3600)]); $created[] = $scheduled;
    fb_assert(get_post_status($scheduled) === 'future', 'Scheduled post status not retained.');
    fb_assert(wp_next_scheduled('publish_future_post', [$scheduled]) !== false, 'Scheduled publication cron event missing.');
    wp_update_post(['ID' => $scheduled, 'post_date' => gmdate('Y-m-d H:i:s', time() - 5), 'post_date_gmt' => gmdate('Y-m-d H:i:s', time() - 5), 'post_status' => 'future']);
    do_action('publish_future_post', $scheduled);
    fb_assert(get_post_status($scheduled) === 'publish', 'Scheduled publication did not publish.');
    wp_update_post(['ID' => $post, 'post_status' => 'publish', 'post_content' => '<h2>Revised fixture</h2><p>Revision test.</p>']);
    fb_assert(count(wp_get_post_revisions($post)) >= 1, 'Blog revisions not retained.');
    $media = wp_insert_post(['post_type' => 'finbharat_media', 'post_status' => 'publish', 'post_title' => 'Integration fixture newsroom', 'post_name' => 'integration-fixture-newsroom', 'post_content' => '<p>Local test announcement.</p>']); $created[] = $media;
    update_post_meta($media, '_fb_fields', ['mediaType' => 'press', 'source' => 'https://www.sebi.gov.in/', 'video' => '', 'captions' => '', 'transcript' => '']);
    $media_response = rest_do_request(new WP_REST_Request('GET', '/wp/v2/finbharat_media'))->get_data();
    fb_assert(($media_response[0]['finbharat']['source'] ?? '') === 'https://www.sebi.gov.in/', 'Newsroom source fields not exposed.');
    update_option('fb_build_hook', 'https://api.netlify.com/build_hooks/local-test');
    Finbharat_Content::shutdown();
    fb_assert($hook_calls === 1 && str_contains(get_option('fb_hook_status'), 'Build requested'), 'Publication hook request failed.');
    $hook_code = 503; Finbharat_Content::dispatch();
    fb_assert(str_contains(get_option('fb_hook_status'), 'failed') && wp_next_scheduled('fb_retry_build', [1]), 'Failed hook request did not schedule a retry.');
    wp_clear_scheduled_hook('fb_retry_build', [1]);
    $hook_code = 202;
    $public = rest_do_request(new WP_REST_Request('GET', '/finbharat/v1/site'))->get_data();
    fb_assert(!str_contains(wp_json_encode($public), 'build_hooks'), 'Public response leaked the build hook.');
    fb_assert(!isset($public['pages']['/terms/']), 'Draft legal content leaked to the public endpoint.');
    echo "Passed: Editor role, homepage update, FAQ and legal update, blog publication/unpublishing, scheduled publication, revisions, newsroom source, publication-triggered hook, retry and draft/secret exclusion.\n";
} finally {
    update_post_meta($home->ID, '_fb_fields', $original_fields);
    update_post_meta($mutual->ID, '_fb_fields', $original_faq);
    update_post_meta($terms->ID, '_fb_fields', $original_terms);
    foreach ($created as $id) { wp_delete_post($id, true); }
    update_option('fb_build_hook', $original_hook);
    update_option('fb_site', $original_site);
    update_option('fb_scenarios', $original_scenarios);
}
