import marked from 'marked';
import hljs from 'highlight.js';
import Vue from 'vue';
// Set options
// `highlight` example uses `highlight.js`
marked.setOptions({
	renderer: new marked.Renderer(),
	highlight: function(code) {
		return hljs.highlightAuto(code).value;
	},
	pedantic: false,
	gfm: true,
	tables: true,
	breaks: false,
	sanitize: false,
	smartLists: true,
	smartypants: false,
	xhtml: false
});

Vue.prototype.$marked = marked;
