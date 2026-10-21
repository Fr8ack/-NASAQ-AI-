import os
import zipfile
import shutil

def create_project_zip():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    os.makedirs(public_dir, exist_ok=True)

    target_zip = os.path.join(public_dir, 'nasap-ai-v1.3.zip')
    fallback_zip = os.path.join(public_dir, 'nasap-ai.zip')
    root_zip = os.path.join(base_dir, 'nasap-ai-v1.3.zip')

    exclude_dirs = {
        '.git', 'node_modules', 'dist', '.cache', '.vite', 
        '.tempmediaStorage', '__pycache__'
    }
    exclude_files = {'.DS_Store'}

    total_files = 0
    with zipfile.ZipFile(target_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for foldername, subfolders, filenames in os.walk(base_dir):
            # prune excluded folders
            subfolders[:] = [d for d in subfolders if d not in exclude_dirs and not d.startswith('.vite')]

            for filename in filenames:
                if filename in exclude_files or filename.endswith('.zip'):
                    continue
                filepath = os.path.join(foldername, filename)
                arcname = os.path.relpath(filepath, base_dir)

                # Skip any zip artifacts inside public or anywhere
                if arcname.startswith('public/') and filename.endswith('.zip'):
                    continue
                if arcname.startswith('.aistudio/artifacts') and '.tempmediaStorage' in arcname:
                    continue

                zipf.write(filepath, arcname)
                total_files += 1

    # Also create copy as nasap-ai.zip and in root
    shutil.copyfile(target_zip, fallback_zip)
    shutil.copyfile(target_zip, root_zip)

    size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"Created ZIP: {target_zip}")
    print(f"Total files: {total_files}, Size: {size_mb:.2f} MB")

if __name__ == '__main__':
    create_project_zip()
