/* Native WordPress media selection and a labelled repeating FAQ form. */
document.addEventListener('click', event => {
  const media = event.target.closest('.fb-media');
  if (media) {
    const frame = window.wp.media({ title: media.dataset.type === 'image' ? 'Choose a website image' : 'Choose a website asset', multiple: false, ...(media.dataset.type ? { library: { type: media.dataset.type } } : {}) });
    frame.on('select', () => {
      const field = document.getElementById(media.dataset.target);
      field.value = frame.state().get('selection').first().toJSON().url;
      field.dispatchEvent(new Event('input', { bubbles: true }));
    });
    frame.open();
  }
  const remove = event.target.closest('.fb-remove');
  if (remove) remove.closest('.fb-repeat-row').remove();
  const add = event.target.closest('.fb-add');
  if (add) {
    const list = add.previousElementSibling;
    const indices = [...list.querySelectorAll('textarea')].map(field => Number(field.name.match(/\[(\d+)\]\[\d+\]$/)?.[1] || 0));
    const index = indices.length ? Math.max(...indices) + 1 : 0;
    const row = document.createElement('div'); row.className = 'fb-repeat-row';
    for (const [part, label] of ['Question', 'Answer'].entries()) {
      const wrapper = document.createElement('div'); wrapper.className = 'fb-field';
      const input = document.createElement('textarea'); input.name = `${add.dataset.prefix}[${index}][${part}]`; input.id = `fb-faq-${Date.now()}-${part}`; input.rows = part ? 4 : 2;
      const heading = document.createElement('label'); heading.htmlFor = input.id; heading.textContent = label;
      wrapper.append(heading, input); row.append(wrapper);
    }
    const button = document.createElement('button'); button.type = 'button'; button.className = 'button fb-remove'; button.textContent = 'Remove question'; row.append(button);
    list.append(row); row.querySelector('textarea').focus();
  }
});

document.addEventListener('input', event => {
  const field = event.target;
  if (!(field instanceof HTMLTextAreaElement)) return;
  const preview = [...document.querySelectorAll('.fb-preview')].find(item => item.dataset.field === field.id);
  if (!preview) return;
  preview.replaceChildren();
  if (/^https?:\/\//.test(field.value)) {
    const image = document.createElement('img'); image.src = field.value; image.alt = 'Selected website image'; preview.append(image);
  }
});
