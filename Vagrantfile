# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "lmayorga1980/ubuntu-trusty-gui"
   config.vm.provider "virtualbox" do |vb|
     vb.gui = true
     vb.memory = "4096"
     vb.customize ["modifyvm", :id, "--vram", "32"]
   end

  config.vm.provision "shell", inline: <<-SHELL
     sudo apt-get update
     sudo apt-get purge gnome
     sudo apt-get install -y git
     sudo apt-get install -y vim
     sudo apt-get install -y golang
     sudo apt-get install -y mongodb
     sudo apt-get install -y curl
     sudo apt-get install -y python3
     sudo apt-get install -y nodejs
     sudo apt-get install -y npm
     sudo ln -s /usr/bin/nodejs /usr/bin/node
     sudo npm install -g bower
     curl -sSL https://get.docker.com/ | sh
     sudo apt-get install -y linux-image-generic-lts-trusty
     git clone https://github.com/tokko/autocv.git
     chown -R vagrant ~/autocv
   SHELL
end
