<?php
/**
 * Plugin Name: Finbharat Content
 * Description: Fixed editorial templates and published content for the Finbharat React website.
 * Version: 1.2.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 */
if (!defined('ABSPATH')) { exit; }

final class Finbharat_Content {
    private static bool $dirty = false;
    private static array $locked = ['path', 'template', 'calculator', 'icon', 'visual', 'initials', 'company', 'art'];

    public static function seed(): array {
        return json_decode(file_get_contents(__DIR__ . '/seed.json'), true, 512, JSON_THROW_ON_ERROR);
    }
    public static function init(): void {
        register_post_type('fb_page', [
            'labels' => ['name' => 'Website pages', 'singular_name' => 'Website page', 'edit_item' => 'Edit website content'],
            'public' => false, 'show_ui' => true, 'show_in_rest' => true,
            'supports' => ['title', 'revisions', 'custom-fields'], 'menu_icon' => 'dashicons-layout',
            'capability_type' => 'page', 'map_meta_cap' => true,
        ]);
        register_post_type('finbharat_media', [
            'labels' => ['name' => 'Newsroom', 'singular_name' => 'Newsroom entry'],
            'public' => false, 'show_ui' => true, 'show_in_rest' => true,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions', 'custom-fields'],
            'menu_icon' => 'dashicons-megaphone', 'capability_type' => 'post', 'map_meta_cap' => true,
        ]);
        register_post_type('finbharat_case', [
            'labels' => ['name' => 'Case studies', 'singular_name' => 'Illustrative case study', 'add_new_item' => 'Add illustrative case study'],
            'public' => false, 'show_ui' => true, 'show_in_rest' => true,
            'supports' => ['title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions', 'custom-fields'],
            'menu_icon' => 'dashicons-id-alt', 'capability_type' => 'post', 'map_meta_cap' => true,
        ]);
        add_theme_support('post-thumbnails');
        foreach (['fb_page', 'post', 'finbharat_media', 'finbharat_case'] as $type) {
            foreach (['_fb_fields', '_fb_seo'] as $key) {
                register_post_meta($type, $key, [
                    'type' => 'object', 'single' => true,
                    'show_in_rest' => ['schema' => ['type' => 'object', 'additionalProperties' => true]],
                    'revisions_enabled' => true,
                    'auth_callback' => static fn($allowed, $meta, $id) => current_user_can('edit_post', $id),
                    'sanitize_callback' => [self::class, 'clean'],
                ]);
            }
            register_post_meta($type, '_fb_approved', ['type' => 'boolean', 'single' => true, 'show_in_rest' => true, 'revisions_enabled' => true, 'auth_callback' => static fn($allowed, $meta, $id) => current_user_can('edit_post', $id)]);
        }
        foreach (['post', 'finbharat_media', 'finbharat_case'] as $type) {
            register_rest_field($type, 'finbharat', ['get_callback' => static function($post) {
                $fields = get_post_meta($post['id'], '_fb_fields', true);
                $seo = get_post_meta($post['id'], '_fb_seo', true);
                return array_merge(is_array($fields) ? $fields : [], ['seoTitle' => $seo['title'] ?? '', 'seoDescription' => $seo['description'] ?? '']);
            }]);
        }
    }
    public static function activate(): void {
        self::init();
        $seed = self::seed();
        if (false === get_option('fb_site', false)) { add_option('fb_site', $seed['site'], '', false); }
        if (false === get_option('fb_scenarios', false)) { add_option('fb_scenarios', $seed['scenarios'], '', false); }
        foreach ($seed['pages'] as $route => $page) {
            $existing = get_posts(['post_type' => 'fb_page', 'post_status' => 'any', 'meta_key' => '_fb_route', 'meta_value' => $route, 'numberposts' => 1]);
            if ($existing) { continue; }
            $approved = $page['approved'] ?? true;
            $id = wp_insert_post(['post_type' => 'fb_page', 'post_title' => $page['title'], 'post_status' => $approved ? 'publish' : 'draft']);
            if (is_wp_error($id) || !$id) { continue; }
            update_post_meta($id, '_fb_route', $route);
            update_post_meta($id, '_fb_fields', $page['fields']);
            update_post_meta($id, '_fb_seo', $page['seo']);
            update_post_meta($id, '_fb_approved', $approved);
        }
        if (!get_option('fb_cases_imported', false)) {
            foreach ($seed['caseStudies'] ?? [] as $case) {
                $existing = get_posts(['post_type' => 'finbharat_case', 'post_status' => 'any', 'name' => $case['slug'], 'numberposts' => 1]);
                if ($existing) { continue; }
                $id = wp_insert_post(['post_type' => 'finbharat_case', 'post_title' => $case['title'], 'post_name' => $case['slug'], 'post_excerpt' => $case['excerpt'], 'post_content' => $case['html'], 'post_status' => 'publish']);
                if (is_wp_error($id) || !$id) { continue; }
                update_post_meta($id, '_fb_fields', $case['fields']);
                update_post_meta($id, '_fb_seo', $case['seo']);
            }
            update_option('fb_cases_imported', true, false);
        }
        update_option('fb_content_version', '1.2.0', false);
        flush_rewrite_rules();
    }
    public static function upgrade(): void {
        if (current_user_can('manage_options') && get_option('fb_content_version') !== '1.2.0') { self::activate(); }
    }
    public static function case_schema(): array {
        return json_decode(file_get_contents(__DIR__ . '/case-field-schema.json'), true, 512, JSON_THROW_ON_ERROR);
    }
    public static function valid_hook(string $hook): bool {
        return (bool)preg_match('#^https://api\.vercel\.com/v1/integrations/deploy/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+(?:\?buildCache=(?:true|false))?$#', $hook)
            || (bool)preg_match('#^https://api\.netlify\.com/build_hooks/[a-zA-Z0-9_-]+$#', $hook);
    }
    public static function clean($value) {
        if (is_array($value)) { return array_map([self::class, 'clean'], $value); }
        if (is_bool($value) || is_numeric($value)) { return $value; }
        return is_string($value) ? wp_kses_post($value) : '';
    }
    public static function rest(): void {
        register_rest_route('finbharat/v1', '/site', ['methods' => 'GET', 'permission_callback' => '__return_true', 'callback' => static function() {
            $pages = [];
            $seed = self::seed();
            foreach (get_posts(['post_type' => 'fb_page', 'post_status' => 'publish', 'numberposts' => -1]) as $post) {
                if ($post->post_password) { continue; }
                $route = get_post_meta($post->ID, '_fb_route', true);
                if (!isset($seed['pages'][$route])) { continue; }
                $pages[$route] = [
                    'status' => 'publish', 'template' => $seed['pages'][$route]['template'],
                    'fields' => get_post_meta($post->ID, '_fb_fields', true),
                    'seo' => get_post_meta($post->ID, '_fb_seo', true),
                    'approved' => (bool)get_post_meta($post->ID, '_fb_approved', true),
                ];
            }
            return rest_ensure_response(['schemaVersion' => 1, 'site' => get_option('fb_site'), 'scenarios' => get_option('fb_scenarios'), 'pages' => $pages]);
        }]);
    }
    public static function menus(): void {
        add_menu_page('Finbharat editorial settings', 'Finbharat', 'edit_pages', 'finbharat', [self::class, 'settings'], 'dashicons-admin-site-alt3', 3);
        add_submenu_page('finbharat', 'Publishing configuration', 'Publishing configuration', 'manage_options', 'finbharat-publishing', [self::class, 'publishing']);
    }
    private static function label(string $key): string {
        static $labels;
        $labels ??= json_decode(file_get_contents(__DIR__ . '/copy-labels.json'), true);
        $case_labels = ['fd' => 'Fixed deposit example', 'sip' => 'Mutual fund / SIP example', 'listingOrder' => 'Listing order (lower appears first)', 'personName' => 'Persona name', 'principal' => 'Deposit amount (INR)', 'monthly' => 'Monthly contribution (INR)', 'rate' => 'Annual rate / return assumption (%)', 'years' => 'Time horizon (years)', 'initial' => 'Initial investment (INR)', 'frequency' => 'Compounding frequency'];
        return $case_labels[$key] ?? $labels[$key] ?? ucwords(str_replace(['_', '-'], ' ', preg_replace('/([a-z])([A-Z])/', '$1 $2', $key)));
    }
    public static function fields(array $value, string $prefix, array $schema, string $parent = ''): void {
        foreach ($schema as $key => $default) {
            if (in_array((string)$key, self::$locked, true)) { continue; }
            $item = $value[$key] ?? $default;
            $name = $prefix . '[' . $key . ']';
            $id = 'fb-' . substr(md5($name), 0, 12);
            $label = self::label((string)$key);
            if (is_array($default)) {
                echo '<details class="fb-group"><summary>' . esc_html($label) . '</summary>';
                if ($key === 'faqs') {
                    echo '<input type="hidden" name="' . esc_attr($name) . '" value=""><div class="fb-repeat">';
                    foreach ($item as $index => $row) {
                        echo '<div class="fb-repeat-row">';
                        self::fields($row, $name . '[' . $index . ']', $default[0], 'faq');
                        echo '<button type="button" class="button fb-remove">Remove question</button></div>';
                    }
                    echo '</div><button type="button" class="button fb-add" data-prefix="' . esc_attr($name) . '">Add question</button>';
                } else { self::fields(is_array($item) ? $item : [], $name, $default, (string)$key); }
                echo '</details>';
            } elseif (is_bool($default)) {
                echo '<p><label><input type="hidden" name="' . esc_attr($name) . '" value="0"><input type="checkbox" name="' . esc_attr($name) . '" value="1" ' . checked((bool)$item, true, false) . '> ' . esc_html($label) . '</label></p>';
                if ($key === 'approved') { echo '<p class="description">Check only after client approval. Intro videos also require captions and a transcript.</p>'; }
            } else {
                $field_label = $parent === 'faq' ? ((string)$key === '0' ? 'Question' : 'Answer') : $label;
                echo '<div class="fb-field"><label for="' . esc_attr($id) . '">' . esc_html($field_label) . '</label>';
                if ($key === 'body' && $parent === 'fields') {
                    wp_editor((string)$item, $id, ['textarea_name' => $name, 'media_buttons' => false, 'textarea_rows' => 12, 'teeny' => true]);
                } else {
                    $rows = strlen((string)$item) > 100 || in_array($key, ['body', 'copy', 'transcript', 'description'], true) ? 4 : 2;
                    echo '<textarea id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" rows="' . (int)$rows . '">' . esc_textarea((string)$item) . '</textarea>';
                    if (preg_match('/image|portrait|poster|video|captions|footerImage|heroPoster|heroVideo/i', (string)$key)) {
                        echo '<button type="button" class="button fb-media" data-target="' . esc_attr($id) . '">Choose from media library</button>';
                    }
                }
                echo '</div>';
            }
        }
    }
    private static function merge(array $schema, array $value): array {
        $result = $schema;
        foreach ($schema as $key => $default) {
            if (in_array((string)$key, self::$locked, true)) { continue; }
            if (!array_key_exists($key, $value)) { continue; }
            if ($key === 'faqs' && $value[$key] === '') { $result[$key] = []; continue; }
            if (is_bool($default)) { $result[$key] = !empty($value[$key]); }
            elseif (is_array($default) && is_array($value[$key])) {
                if ($key === 'faqs') {
                    $result[$key] = [];
                    foreach (array_slice($value[$key], 0, 100) as $row) {
                        if (is_array($row) && trim((string)($row[0] ?? '')) !== '') { $result[$key][] = self::merge($default[0], $row); }
                    }
                } else { $result[$key] = self::merge($default, $value[$key]); }
            } elseif (is_string($default)) { $result[$key] = wp_kses_post((string)$value[$key]); }
        }
        return $result;
    }
    public static function settings(): void {
        if (!current_user_can('edit_pages')) { return; }
        $seed = self::seed();
        echo '<div class="wrap fb-editor"><h1>Finbharat editorial settings</h1><p>Update shared content, founder profiles, approved links and illustrative scenarios. Layout and calculators stay in the website code.</p><p>Changes appear after a successful website rebuild. Configure the publishing hook before client handover.</p><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="fb_settings">';
        wp_nonce_field('fb_settings');
        self::fields(['site' => get_option('fb_site'), 'scenarios' => get_option('fb_scenarios')], 'fb', ['site' => $seed['site'], 'scenarios' => $seed['scenarios']]);
        submit_button('Save and publish shared content');
        echo '</form></div>';
    }
    public static function save_settings(): void {
        if (!current_user_can('edit_pages')) { wp_die('You cannot edit website content.'); }
        check_admin_referer('fb_settings');
        $seed = self::seed();
        $data = wp_unslash($_POST['fb'] ?? []);
        update_option('fb_site', self::merge($seed['site'], $data['site'] ?? []), false);
        update_option('fb_scenarios', self::merge($seed['scenarios'], $data['scenarios'] ?? []), false);
        self::$dirty = true;
        wp_safe_redirect(admin_url('admin.php?page=finbharat&updated=1'));
        exit;
    }
    public static function publishing(): void {
        echo '<div class="wrap"><h1>Finbharat publishing configuration</h1><p>Administrator only. The Vercel deploy hook is a secret and is never sent to the public frontend.</p><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="fb_publishing">';
        wp_nonce_field('fb_publishing');
        echo '<p><label for="fb-hook">Vercel HTTPS deploy hook</label><br><input id="fb-hook" type="password" name="hook" value="" autocomplete="new-password" class="large-text"><span class="description">Leave blank to retain the existing hook.</span></p><p><label for="fb-origin">Public frontend URL (for published website links)</label><br><input id="fb-origin" type="url" name="frontend" value="' . esc_attr(get_option('fb_frontend', '')) . '" class="large-text"></p>';
        submit_button('Save publishing configuration');
        echo '</form><p>Last hook status: ' . esc_html(get_option('fb_hook_status', 'Not configured')) . '</p><p>WordPress.com: enable the documented missed-schedule monitor or a managed external cron. Verify scheduled publication on this installation before launch.</p></div>';
    }
    public static function save_publishing(): void {
        if (!current_user_can('manage_options')) { wp_die('Administrator access required.'); }
        check_admin_referer('fb_publishing');
        $hook = trim(wp_unslash($_POST['hook'] ?? ''));
        if ($hook !== '') {
            if (!self::valid_hook($hook)) { wp_die('Use the HTTPS deploy-hook URL supplied by Vercel.'); }
            update_option('fb_build_hook', $hook, false);
        }
        $frontend = esc_url_raw(wp_unslash($_POST['frontend'] ?? ''), ['https']);
        update_option('fb_frontend', $frontend, false);
        self::$dirty = true;
        wp_safe_redirect(admin_url('admin.php?page=finbharat-publishing&updated=1'));
        exit;
    }
    public static function boxes(): void {
        foreach (['fb_page', 'post', 'finbharat_media', 'finbharat_case'] as $type) { add_meta_box('fb-content', 'Finbharat website content', [self::class, 'box'], $type, 'normal', 'high'); }
    }
    public static function box(WP_Post $post): void {
        wp_nonce_field('fb_content', 'fb_nonce');
        echo '<div class="fb-editor">';
        if ($post->post_type === 'fb_page') {
            $route = get_post_meta($post->ID, '_fb_route', true);
            $page = self::seed()['pages'][$route] ?? null;
            if (!$page) { echo '<p>Website pages are imported by the plugin. Edit an existing template instead of creating a new page.</p></div>'; return; }
            echo '<p>Fixed template: <strong>' . esc_html($page['template']) . '</strong> · Website route: <code>' . esc_html($route) . '</code></p>';
            $fields = get_post_meta($post->ID, '_fb_fields', true);
            self::fields(['fields' => is_array($fields) ? $fields : $page['fields']], 'fb', ['fields' => $page['fields']]);
            self::fields(['approved' => (bool)get_post_meta($post->ID, '_fb_approved', true)], 'fb', ['approved' => false]);
        } elseif ($post->post_type === 'finbharat_case') {
            echo '<p><strong>Fictional, illustrative planning story.</strong> The frontend always displays the fictional-story disclosure. Portraits are generated illustrations; the website does not show badges on the images. Do not present these personas as customers or claim actual financial results.</p><p>Write the story in the article editor. Use headings from H2. Add an excerpt, an ASCII lowercase/hyphen slug and an AI-generated portrait. A featured image overrides the portrait URL below. Calculator formulas remain in frontend code; edit only the sample assumptions.</p>';
            self::fields(get_post_meta($post->ID, '_fb_fields', true) ?: [], 'fb[fields]', self::case_schema());
            echo '<p>FD frequency: 1 yearly, 2 half-yearly, 4 quarterly, 12 monthly. Rates: 0–30%; years: 1–50; age: 18–100. Enabled examples need valid amounts. Sample rates are not offers or forecasts.</p>';
        } elseif ($post->post_type === 'finbharat_media') {
            $fields = get_post_meta($post->ID, '_fb_fields', true) ?: [];
            echo '<p><label for="fb-media-type">Entry type</label> <select id="fb-media-type" name="fb[fields][mediaType]">';
            foreach (['announcement' => 'Company announcement', 'press' => 'Press coverage', 'video' => 'Video'] as $value => $label) { echo '<option value="' . esc_attr($value) . '" ' . selected($fields['mediaType'] ?? 'announcement', $value, false) . '>' . esc_html($label) . '</option>'; }
            echo '</select></p>';
            self::fields($fields, 'fb[fields]', ['source' => '', 'video' => '', 'captions' => '', 'transcript' => '']);
            echo '<p>Use the original publication URL for press coverage. Videos with speech need captions and a transcript. Upload only assets you have permission to use.</p>';
        }
        self::fields(get_post_meta($post->ID, '_fb_seo', true) ?: [], 'fb[seo]', ['title' => '', 'description' => '']);
        echo '</div>';
    }
    public static function save_post(int $id): void {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE || wp_is_post_revision($id) || !isset($_POST['fb_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['fb_nonce'])), 'fb_content') || !current_user_can('edit_post', $id)) { return; }
        $data = wp_unslash($_POST['fb'] ?? []);
        if (get_post_type($id) === 'fb_page') {
            $route = get_post_meta($id, '_fb_route', true);
            $schema = self::seed()['pages'][$route]['fields'] ?? null;
            if ($schema) { update_post_meta($id, '_fb_fields', self::merge($schema, $data['fields'] ?? [])); }
            update_post_meta($id, '_fb_approved', !empty($data['approved']));
        } elseif (get_post_type($id) === 'finbharat_case') {
            update_post_meta($id, '_fb_fields', self::merge(self::case_schema(), $data['fields'] ?? []));
        } elseif (get_post_type($id) === 'finbharat_media') {
            $fields = self::merge(['source' => '', 'video' => '', 'captions' => '', 'transcript' => ''], $data['fields'] ?? []);
            $fields['mediaType'] = in_array($data['fields']['mediaType'] ?? '', ['announcement', 'press', 'video'], true) ? $data['fields']['mediaType'] : 'announcement';
            update_post_meta($id, '_fb_fields', $fields);
        }
        update_post_meta($id, '_fb_seo', self::merge(['title' => '', 'description' => ''], $data['seo'] ?? []));
    }
    public static function changed(int $id, WP_Post $post, bool $update, ?WP_Post $before): void {
        if (wp_is_post_revision($id) || !in_array($post->post_type, ['post', 'fb_page', 'finbharat_media', 'finbharat_case', 'attachment'], true)) { return; }
        if ($post->post_status === 'publish' || ($before && $before->post_status === 'publish') || $post->post_type === 'attachment') { self::$dirty = true; }
    }
    public static function removed(int $id): void {
        $post = get_post($id);
        if ($post && ($post->post_status === 'publish' || $post->post_type === 'attachment')) { self::$dirty = true; }
    }
    public static function dispatch(int $attempt = 0): void {
        $hook = get_option('fb_build_hook', '');
        if (!$hook) { update_option('fb_hook_status', 'Not configured', false); return; }
        if (!self::valid_hook($hook)) { update_option('fb_hook_status', 'Invalid deploy-hook URL. Update Publishing configuration.', false); return; }
        $response = wp_remote_post($hook, ['timeout' => 8, 'body' => '{}', 'headers' => ['Content-Type' => 'application/json'], 'redirection' => 0]);
        $code = is_wp_error($response) ? 0 : wp_remote_retrieve_response_code($response);
        if ($code >= 200 && $code < 300) { update_option('fb_hook_status', 'Build requested at ' . current_time('mysql') . '. Check your hosting dashboard for deployment status.', false); }
        else {
            update_option('fb_hook_status', 'Build request failed at ' . current_time('mysql') . '; HTTP ' . (int)$code . '. Check the configuration and hosting deployment status.', false);
            if ($attempt < 3 && !wp_next_scheduled('fb_retry_build', [$attempt + 1])) { wp_schedule_single_event(time() + 60 * ($attempt + 1), 'fb_retry_build', [$attempt + 1]); }
        }
    }
    public static function shutdown(): void { if (self::$dirty) { self::$dirty = false; self::dispatch(); } }
    public static function website_link(string $url, WP_Post $post): string {
        $origin = get_option('fb_frontend', '');
        if (!$origin || $post->post_status !== 'publish') { return $url; }
        $route = match ($post->post_type) {
            'fb_page' => get_post_meta($post->ID, '_fb_route', true),
            'post' => '/blog/' . $post->post_name . '/',
            'finbharat_media' => '/media/' . $post->post_name . '/',
            'finbharat_case' => '/case-studies/' . $post->post_name . '/',
            default => '',
        };
        return $route ? rtrim($origin, '/') . $route : $url;
    }
    public static function assets(string $hook): void {
        if (!in_array($hook, ['post.php', 'post-new.php', 'toplevel_page_finbharat'], true)) { return; }
        wp_enqueue_media();
        wp_enqueue_style('fb-editor', plugins_url('editor.css', __FILE__), [], '1.2.0');
        wp_enqueue_script('fb-editor', plugins_url('editor.js', __FILE__), [], '1.2.0', true);
    }
}
register_activation_hook(__FILE__, [Finbharat_Content::class, 'activate']);
add_action('init', [Finbharat_Content::class, 'init']);
add_action('rest_api_init', [Finbharat_Content::class, 'rest']);
add_action('admin_init', [Finbharat_Content::class, 'upgrade']);
add_action('admin_menu', [Finbharat_Content::class, 'menus']);
add_action('add_meta_boxes', [Finbharat_Content::class, 'boxes']);
add_action('save_post', [Finbharat_Content::class, 'save_post']);
add_action('admin_post_fb_settings', [Finbharat_Content::class, 'save_settings']);
add_action('admin_post_fb_publishing', [Finbharat_Content::class, 'save_publishing']);
add_action('wp_after_insert_post', [Finbharat_Content::class, 'changed'], 10, 4);
add_action('before_delete_post', [Finbharat_Content::class, 'removed']);
add_action('shutdown', [Finbharat_Content::class, 'shutdown']);
add_action('fb_retry_build', [Finbharat_Content::class, 'dispatch']);
add_action('admin_enqueue_scripts', [Finbharat_Content::class, 'assets']);
add_filter('use_block_editor_for_post_type', static fn($use, $type) => $type === 'fb_page' ? false : $use, 10, 2);
add_filter('allowed_block_types_all', static fn() => ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/image', 'core/separator']);
add_filter('wp_robots', static function($robots) { $robots['noindex'] = true; return $robots; });

add_filter('post_type_link', [Finbharat_Content::class, 'website_link'], 10, 2);
add_filter('post_link', [Finbharat_Content::class, 'website_link'], 10, 2);
