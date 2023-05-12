let use_vs = false;

let default_vs = `// Vertex Shader
attribute vec4 a_position; 
void main() {
\tgl_Position = a_position;
}`

let default_fs = `// Fragment Shader
void main() {
\tgl_FragColor = vec4(BLUE, 1.0);
}`

const refresh     = document.querySelector('#refresh');
const clear       = document.querySelector('#clear');
const save        = document.querySelector('#save');
const help        = document.querySelector('#help');
const help_msg    = document.querySelector('#help_msg');

const editors     = document.querySelectorAll('code-input textarea');

const fs_el       = document.querySelector('#frag-shader');
const vs_el       = document.querySelector('#vert-shader');

const canvas      = document.querySelector('#canvas');
const sandbox     = new GlslCanvas(canvas);

const upload_el   = document.querySelector('#upload');

const desc_el     = document.querySelector('#desc');
const res_box     = document.querySelector('#res');
const time_box    = document.querySelector('#time');

const url_params  = new Proxy(new URLSearchParams(window.location.search), {
   get: (searchParams, prop) => searchParams.get(prop),
 });

let load_id = url_params.id;

const before   = `
precision mediump float;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
#define RED vec3(204.0 / 256.0, 36.0 / 256.0, 29.0 / 256.0)
#define BLUE vec3(69.0 / 256.0, 133.0 / 256.0, 136.0 / 256.0)
#define GREEN vec3(152.0 / 256.0, 151.0 / 256.0, 26.0 / 256.0)
#define YELLOW vec3(215.0 / 256.0, 153.0 / 256.0, 33.0 / 256.0)
#define BLACK vec3(29.0 / 256.0, 32.0 / 256.0, 33.0 / 256.0)
`

let fs = () => { return before + String(fs_el.value); };
let vs = () => { if (use_vs) { return String(vs_el.value); } else { return default_vs; } };

function use_editors() {
    codeInput.registerTemplate("syntax-highlighted", codeInput.templates.hljs(hljs, []));

   //  editors.forEach((editor) => {
   //    editor.after.content = 
   //  })
}

function use_shaders() {
   console.log(fs() + "\n" + vs());
   sandbox.load(fs(), vs());
   res.innerText = canvas.width + 'x' + canvas.height
}

refresh.addEventListener('click', () => {
   use_shaders();
})

clear.addEventListener('click', () => {
   localStorage.clear();
})

save.addEventListener('click', () => {
      cookie_save();
})

function set_desc(val) {
   desc_el.value = val;
}

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
//    document.cookie = `fs=${encodeURIComponent(fs_el.value)}; SameSite=Lax; Secure`;
//    document.cookie = `vs=${encodeURIComponent(vs_el.value)}; SameSite=Lax; Secure`;

   localStorage.setItem('fs', fs_el.value);
   localStorage.setItem('vs', vs_el.value);
}

function load() {
   vs_el.value = localStorage.getItem('vs') || default_vs;
   fs_el.value = localStorage.getItem('fs') || default_fs;
}

help.addEventListener('click', () => {
   switch (help_msg.style.display) {
      case "inline-block": help_msg.style.display = "none"; break;
      default:  help_msg.style.display = "inline-block";
   }
})

async function upload(text) {
   let res = await fetch('upload.php', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
          'code': text,
      })
  });
  let code = await res.text();
  return code;
}

async function download(id) {
   let res = await fetch('view.php', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },    
      body: new URLSearchParams({
          'id': id,
      })
  });
  let code = await res.text();
  return code;
}

upload_el.addEventListener('click', async () => {
   alert("saved at:\nhttps://nest.place/glsl?id=" + await upload(
      encodeURIComponent(fs_el.value)
      + "\n===\n" + 
      encodeURIComponent(vs_el.value)
      + "\n===\n" +
      encodeURIComponent(desc_el.value)
      )
   );
})

if (load_id != null) {
   (async () => {
      let loaded = decodeURIComponent(await download(load_id));
      let new_fs = loaded.split('\n===\n')[0];
      let new_vs = loaded.split('\n===\n')[1];
      let new_desc = loaded.split('\n===\n')[2];
      fs_el.value = new_fs;
      vs_el.value = new_vs;
      desc_el.value = new_desc;
      use_shaders();
   })();
}

function enable_tabs() {
   document.querySelectorAll('code-input textarea').forEach((editor) => {
      editor.addEventListener('keydown', function(e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
    
        this.value = this.value.substring(0, start) +
          "\t" + this.value.substring(end);

        this.selectionStart = 
        this.selectionEnd = start + 1;
      }
    })
   });
}

function update_t() {
   time_box.innerText = 't+' + (Math.round(sandbox.timePrev / 10) / 100) + 's';
   setTimeout(update_t, 200);
}

use_editors();
load();
use_shaders();
enable_tabs();
update_t()
