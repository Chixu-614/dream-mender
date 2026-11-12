"""仅开发时运行；生成的 HTML 使用时不需要 Python。"""
from pathlib import Path
import re, base64, json
root = Path(__file__).resolve().parent
assets = {p.name: 'data:image/svg+xml;base64,'+base64.b64encode(p.read_bytes()).decode() for p in (root/'assets').glob('*.svg')}
html = (root/'index.html').read_text()
def css(m):
    return '<style>'+ (root/m[1].split('?')[0]).read_text()+'</style>'
html = re.sub(r'<link rel="stylesheet" href="([^"]+)"\s*/?>',css,html)
def script(m):
    code=(root/m[1].split('?')[0]).read_text()
    code=code.replace("'assets/'+d.image+'.svg'", "window.ATELIER_ASSETS[d.image+'.svg']")
    code=code.replace("'assets/guest-'+r.kind+'.svg'", "window.ATELIER_ASSETS['guest-'+r.kind+'.svg']")
    code=code.replace("'assets/guest-'+x.kind+'.svg'", "window.ATELIER_ASSETS['guest-'+x.kind+'.svg']")
    for name,data in assets.items():
        code=code.replace("'assets/"+name+"'",json.dumps(data))
    if 'assets/' in code: raise RuntimeError('未处理的动态资源: '+m[1])
    return '<script>'+code.replace('</script','<\\/script')+'</script>'
html=re.sub(r'<script src="([^"]+)"></script>',script,html)
html=re.sub(r'src="assets/([^"]+)"',lambda m:'src="'+assets[m[1].split('?')[0]]+'"',html)
html=html.replace('</head>','<script>window.ATELIER_ASSETS='+json.dumps(assets)+';</script></head>')
if re.search(r'(?:src|href)="(?:assets/|[^"\s]+\.(?:js|css)(?:\?|"))',html): raise RuntimeError('仍有外部依赖')
output=root/'梦境织补屋-直接打开.html'
output.write_text(html)
print(str(output),output.stat().st_size,'bytes')
