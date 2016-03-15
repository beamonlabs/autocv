on host machine:
  requires virtualbox and vagrant. Install these first
  Use the Vagrantfile to provision a develpoment machine: vagrant up --provision
  When provisioning finishes: vagrant reload

on virtual machine:
  generate ssh-key: ssh-keygen
  print pub key to console: cat ~/.ssh/id_rsa.pub
  copy the ssh-key and add it to your github account
  
  clone this git repo
  develop and profit

docker run -d --name autocv --volumes_from autocv_data -p 8080:8080 --net=dmz beamonlabs/autocv:prod
