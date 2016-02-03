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
     sudo apt-get install -y git vim golang mongodb curl python3 nodejs npm
     mkdir -p /home/vagrant/gohome/src
     mkdir -p /home/vagrant/gohome/bin
     sudo chown -R vagrant /home/vagrant/gohome
     sudo echo "export GOPATH=/home/vagrant/gohome" >> /etc/profile
     sudo echo "export GOBIN=/home/vagrant/gohome/bin" >> /etc/profile
     sudo ln -s /usr/bin/nodejs /usr/bin/node
     sudo npm install -g bower
     sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
     sudo echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" >> /etc/apt/sources.list.d/docker.list
     sudo apt-get update
     sudo apt-get purge -y lxc-docker
     sudo apt-get install -y docker-engine
     sudo gpasswd -a vagrant
     sudo service docker restart
     sudo curl -L https://github.com/docker/compose/releases/download/1.6.0-rc2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
   SHELL
end
