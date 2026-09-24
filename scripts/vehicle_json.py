"""Load/save vehicle JSON files in the repo's house style.

Objects inside arrays that hold only scalar values and fit on one line
(parts, related issues, sources) are written inline; everything else is
standard 2-space JSON.
Used by the one-off content scripts so edits don't reformat whole files.
"""
import json

INLINE_MAX = 160


def _scalar(v):
    return not isinstance(v, (dict, list))


def _dump(value, indent, parent_key):
    # parent_key is '[]' when value is an array element
    pad = '  ' * indent
    if isinstance(value, dict):
        if not value:
            return '{}'
        if parent_key == '[]' and all(_scalar(v) for v in value.values()):
            inline = '{ ' + ', '.join(f'{json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in value.items()) + ' }'
            if len(inline) + len(pad) <= INLINE_MAX:
                return inline
        items = [f'{pad}  {json.dumps(k, ensure_ascii=False)}: {_dump(v, indent + 1, k)}' for k, v in value.items()]
        return '{\n' + ',\n'.join(items) + f'\n{pad}}}'
    if isinstance(value, list):
        if not value:
            return '[]'
        items = [f'{pad}  {_dump(v, indent + 1, "[]")}' for v in value]
        return '[\n' + ',\n'.join(items) + f'\n{pad}]'
    return json.dumps(value, ensure_ascii=False)


def dumps(data):
    return _dump(data, 0, None) + '\n'


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def save(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(dumps(data))
