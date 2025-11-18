Copy the BrittanySignature.ttf font from the project docs folder into this directory so the frontend can use it:

From repository root (PowerShell):

Copy-Item -Path .\docs\brittany_signature\BrittanySignature.ttf -Destination .\frontend\public\fonts\BrittanySignature.ttf -Force

Or move the file using your file manager. After copying, restart the dev server if running so Next.js can serve the new static asset.
