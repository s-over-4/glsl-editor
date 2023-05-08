const refresh  = document.querySelector('#refresh');
const clear    = document.querySelector('#clear');
const save     = document.querySelector('#save');

const fs_el    = document.querySelector('#frag-shader');

const canvas   = document.querySelector('#canvas');
const sandbox  = new GlslCanvas(canvas);

let fs         = () => { return String(fs_el.value) };

function use_editors() {
    codeInput.registerTemplate("syntax-highlighted", codeInput.templates.hljs(hljs, [
      new codeInput.plugins.Autocomplete(() => {}), 
      new codeInput.plugins.Indent(),
   ]));
}

function use_shaders() {
   console.log(fs());
   sandbox.load(fs());
}

refresh.addEventListener('click', () => {
   use_shaders();
})

clear.addEventListener('click', () => {
   document.cookie = `fs=; SameSite=Lax; Secure`;
   document.cookie = `vs=; SameSite=Lax; Secure`;
})

save.addEventListener('click', () => {
      cookie_save();
})

document.addEventListener('keydown', (e) => {
   if (e.code == 'Enter' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      use_shaders();
   } else if (e.code == 'KeyS' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      cookie_save();
   }
})

function cookie_save() {
   document.cookie = `fs=${encodeURIComponent(fs())}; SameSite=Lax; Secure`;
}

function load() {
   cookie_fs = decodeURIComponent(document.cookie
      .split("; ")
      .find((row) => row.startsWith("fs="))
      ?.split("=")[1]);

   if (cookie_fs != '' && cookie_fs != 'undefined') {
      fs_el.value = cookie_fs;
   } else {
      fs_el.value = 
`// Fragment Shader
precision highp float;
void main() {
   vec3 col = vec3(gl_FragCoord.x / 100.0);
   gl_FragColor = vec4(col, 1.0);
}`
   }
}