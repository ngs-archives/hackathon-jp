#app name
set :application, "server"
#
set :deploy_via, "export"
#svn url
set :repository,  "https://hackathon-jp.googlecode.com/svn/trunk/OpenSocial20090611/moso/srv/trunk"
#svn username
set :scm_username, "wada@jugem.co.jp"
#svn password
set :scm_password, "UC8eu8Ua5va9"
#
set :deploy_via, :rsync_with_remote_cache
set :use_sudo, false
#set :rsync_options, '-i /Users/d5f/projects/amazonWS/aeweb01.pem' 
#deply dir
set :deploy_to, "/var/ugatta"
#server user
set :runner, nil

set :user, "root"

# If you aren't deploying to /u/apps/#{application} on the target
# servers (which is the default), you can specify the actual location
# via the :deploy_to variable:
# set :deploy_to, "/var/www/#{application}"

# If you aren't using Subversion to manage your source code, specify
# your SCM below:
# set :scm, :subversion

role :app, "ec2-174-129-93-227.compute-1.amazonaws.com"
role :web, "ec2-174-129-93-227.compute-1.amazonaws.com"

#namespace :deploy do
#  task :restart do
#    restart_mongrel_cluster
#  end
#end
ssh_options[:verbose] = :debug
#ssh_options[:keys] = "/Users/d5f/projects/amazonWS/aeweb01.pem"
#set :html_path, '/var/www/'
#set :dropbox_path, '/Users/d5f/MyDropbox/Dropbox/JugemShare/jugem_site/jugem_html/'
#set :target_host, "www.jugem.co.jp"
#task :sync_html, :roles => :app do
#  system("rsync -rvte ssh --progress --delete --stats --exclude '*~' #{dropbox_path} #{user}@192.168.100.21:#{html_path}")
#end

#task :before_deploy, :roles => :app do
#  sync_html
#end

set :mongrel_conf, '/var/ugatta/current/config/mongrel_cluster.yml'

namespace :deploy do
  namespace :mongrel do
    [ :stop, :start, :restart ].each do |t|
      desc "#{t.to_s.capitalize} the mongrel appserver"
      task t, :roles => :app do
        #invoke_command checks the use_sudo variable to determine how to run the mongrel_rails command
        invoke_command "mongrel_rails cluster::#{t.to_s} -C #{mongrel_conf}", :via => run_method
      end
    end
  end
 
  desc "Custom restart task for mongrel cluster"
  task :restart, :roles => :app, :except => { :no_release => true } do
    deploy.mongrel.restart
  end
 
  desc "Custom start task for mongrel cluster"
  task :start, :roles => :app do
    deploy.mongrel.start
  end
 
  desc "Custom stop task for mongrel cluster"
  task :stop, :roles => :app do
    deploy.mongrel.stop
  end
 
end