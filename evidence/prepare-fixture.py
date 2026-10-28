#!/usr/bin/env python3
"""Copy unmodified style/view-model source versions into a disposable RN app."""
from pathlib import Path
import io
import shutil
import subprocess
import sys
import tarfile

repo = Path(__file__).resolve().parents[1]
app = Path(sys.argv[1]).resolve()
if not (app / 'node_modules/react-native/package.json').is_file():
    raise SystemExit('Expected an installed disposable React Native app')
for name in ('ciceroneBefore', 'ciceroneAfter'):
    if (app / name).exists():
        raise SystemExit(f'Refusing to overwrite {name}')
for name, revision in (
    ('ciceroneBefore', '3a43f3ef4e2e7795b4b7d7fbda54bf9bbb6e65ac'),
    ('ciceroneAfter', '5138a5d'),
):
    archive = subprocess.check_output(['git', '-C', str(repo), 'archive', revision, 'src'])
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        for member in tar.getmembers():
            if member.isfile() and '/__tests__/' not in member.name:
                target = app / name / Path(member.name).relative_to('src')
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(tar.extractfile(member).read())
shutil.copy2(Path(__file__).with_name('App.tsx'), app / 'CiceroneHitAreaFixture.tsx')
print('Use CiceroneHitAreaFixture as the app root. Existing App.tsx was not overwritten.')
