# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "lmayorga1980/ubuntu-trusty-gui"
   config.vm.provider "virtualbox" do |vb|
     vb.gui = true
     vb.memory = "4096"
     vb.customize ["modifyvm", :id, "--vram", "32"]
   end
   config.vm.network :forwarded_port, guest: 22, host: 1234

  config.vm.provision "shell", inline: <<-SHELL
     sudo su
     apt-get update
     apt-get install -y git vim golang mongodb curl python3 nodejs npm
     mkdir -p /home/vagrant/gohome/src
     mkdir -p /home/vagrant/gohome/bin
     chown -R vagrant /home/vagrant/gohome
     echo "export GOPATH=/home/vagrant/gohome" >> /etc/profile
     echo "export GOBIN=/home/vagrant/gohome/bin" >> /etc/profile
     ln -s /usr/bin/nodejs /usr/bin/node
     npm install -g bower
     apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
     echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" >> /etc/apt/sources.list.d/docker.list
     apt-get update
     apt-get purge -y lxc-docker
     apt-get install -y docker-engine
     gpasswd -a vagrant docker
     service docker restart
     curl -L https://github.com/docker/compose/releases/download/1.6.0-rc2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
   SHELL
end
