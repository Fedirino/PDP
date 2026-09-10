import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = source.indexOf('function spRawHTML(');
const end = source.indexOf('function docToText(', start);
const context = vm.createContext({
  esc: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
  spOrder: () => { throw new Error('Scans must not use category sorting'); }
});
vm.runInContext(source.slice(start, end), context);
const section = (category, page, boxOrder) => ({
  category, page, boxOrder, bullets: [],
  tables: [{ headers: ['Position', 'Left', 'Middle', 'Right'],
    rows: [['Shelf', 'Grapes A', 'Grapes B', 'Grapes C'],
      ['Well', 'Berries', '', '<printed text>']] }]
});
const doc = { preserveOrder: true, sections: [
  section('First upload page two', 2, 1),
  section('Second upload page one', 1, 1)
] };
const html = context.spSectionsHTML(doc);
assert(html.indexOf('First upload') < html.indexOf('Second upload'), 'Appended uploads must not interleave');
for (const value of ['Grapes A', 'Grapes B', 'Grapes C', 'Berries']) assert(html.includes(value));
assert(html.includes('&lt;printed text&gt;'), 'Printed content must be escaped');
assert(html.includes('class="blank"'), 'Blank cells must retain their position');
assert(!html.includes('Deck'), 'Renderer must not invent placement labels');
const assignment = source.match(/scanParsed=\{ date:parsed\.date[^\n]+/)[0].trim();
vm.runInContext(`var parsed={}, sections=[], docPages=[], scanMode='salesplan'; ${assignment}`, context);
assert.equal(context.scanParsed.preserveOrder, true, 'Preview must use the same lossless rendering as saved scans');
console.log('Display Plan regression checks passed: preview, all columns, blank cells, escaping, append order.');
