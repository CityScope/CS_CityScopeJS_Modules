# #!/bin/bash
# clear dist folder 
sudo rm -rf dist
# build the dist for public url 
sudo parcel build index.html --public-url https://cityscope.media.mit.edu/CS_choiceModels_table/

# make sure to add dist to commit if .gitignored 
git add dist -f
#commit the GH pages changes 
git commit -m "gh-pages commit"
#push to subtree remote [Force] 
git push origin `git subtree split --prefix dist master`:gh-pages --force


