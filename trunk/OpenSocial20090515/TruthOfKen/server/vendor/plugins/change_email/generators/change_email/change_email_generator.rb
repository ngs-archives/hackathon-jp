require File.expand_path(File.dirname(__FILE__) + "/lib/insert_routes.rb")
class ChangeEmailGenerator < Rails::Generator::NamedBase
                  
  attr_reader   :controller_name,
                :controller_class_path,
                :controller_file_path,
                :controller_class_nesting,
                :controller_class_nesting_depth,
                :controller_class_name,
                :controller_singular_name,
                :controller_plural_name,
                :controller_file_name,
                :user_model_name
  alias_method  :controller_table_name, :controller_plural_name

  def initialize(runtime_args, runtime_options = {})
    super

    @user_model_name = (args.shift || 'user')
    @controller_name = @name.pluralize || 'emails'
    
    base_name, @controller_class_path, @controller_file_path, @controller_class_nesting, @controller_class_nesting_depth = extract_modules(@controller_name)
    @controller_class_name_without_nesting, @controller_file_name, @controller_plural_name = inflect_names(base_name)
    @controller_singular_name = @controller_file_name.singularize

    if @controller_class_nesting.empty?
      @controller_class_name = @controller_class_name_without_nesting
    else
      @controller_class_name = "#{@controller_class_nesting}::#{@controller_class_name_without_nesting}"
    end

  end

  def manifest
    recorded_session = record do |m|
      m.class_collisions controller_class_path,       "#{controller_class_name}Controller",
                                                      "#{controller_class_name}Helper"
      m.class_collisions class_path,                  "#{class_name}", "#{class_name}Mailer", "#{class_name}MailerTest", "#{class_name}Observer"
      m.class_collisions [], 'AuthenticatedSystem', 'AuthenticatedTestHelper'

      m.directory File.join('app/models', class_path)
      m.directory File.join('app/controllers', controller_class_path)
      m.directory File.join('app/helpers', controller_class_path)
      m.directory File.join('app/views', controller_class_path, controller_file_name)
      m.directory File.join('app/views', class_path, "#{file_name}_mailer")

      m.template 'model.rb', File.join('app/models', class_path, "#{file_name}.rb")

      m.template 'mailer.rb',
                  File.join('app/models', class_path, "#{file_name}_mailer.rb")

      m.template 'controller.rb',
                  File.join('app/controllers',
                            controller_class_path,
                            "#{controller_file_name}_controller.rb")


      m.template 'helper.rb',
                  File.join('app/helpers',
                            controller_class_path,
                            "#{controller_file_name}_helper.rb")

      m.template 'edit.html.erb',  File.join('app/views', controller_class_path, controller_file_name, "edit.html.erb")

      unless options[:skip_migration]
        m.migration_template 'migration.rb', 'db/migrate', :assigns => {
          :migration_name => "Create#{class_name.pluralize.gsub(/::/, '')}"
        }, :migration_file_name => "create_#{file_path.gsub(/\//, '_').pluralize}"
      end

      %w(change_email).each do |action|
        m.template "#{action}.html.erb",
                   File.join('app/views', "#{file_name}_mailer", "#{action}.html.erb")
      end

      m.route_resources  controller_plural_name
      m.route_name('activate_email', '/activate_email/:activation_code', { :controller => controller_plural_name, :action => 'activate' })
      m.route_name('change_email', '/change_email', { :controller => controller_plural_name, :action => 'edit' })

    end

    action = nil
    action = $0.split("/")[1]

    recorded_session
  end

  
  protected
    def banner
      "Usage: #{$0} change_email ModelName UserModelName"
    end

    def add_options!(opt)
      opt.separator ''
      opt.separator 'Options:'
    end
end
