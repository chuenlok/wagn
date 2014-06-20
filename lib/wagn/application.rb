# -*- encoding : utf-8 -*-

require 'wagn/all'
require 'active_support/core_ext/numeric/time'
if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(:assets => %w(development test))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end


module Wagn
  class Application < Rails::Application
    
    initializer :load_wagn_environment_config, :before => :load_environment_config, :group => :all do
      add_wagn_path paths, "lib/wagn/config/environments", :glob => "#{Rails.env}.rb"   
      paths["lib/wagn/config/environments"].existent.each do |environment|
        require environment
      end
    end
    
    initializer :load_wagn_config_initializers,  :before => :load_config_initializers do
      add_wagn_path paths, 'lib/wagn/config/initializers', :glob => "**/*.rb" 
      config.paths['lib/wagn/config/initializers'].existent.sort.each do |initializer|
        load(initializer)
      end
    end
    
    class << self
      def inherited(base)
        Rails.application = base.instance
        Rails.application.add_lib_to_load_path!
        ActiveSupport.run_load_hooks(:before_configuration, base.instance)
      end      
    end
    
    def config
      @config ||= begin
        config = super
        
        config.i18n.enforce_available_locales = true
        
        config.autoload_paths += Dir["#{Wagn.gem_root}/app/**/"]
        config.autoload_paths += Dir["#{Wagn.gem_root}/lib/**/"]
        config.autoload_paths += Dir["#{Wagn.gem_root}/mods/standard/lib/**/"]
        
        config.assets.enabled = false
        config.assets.version = '1.0'
        
        
        config.encoding              = "utf-8"
        config.filter_parameters    += [:password]
        config.read_only             = !!ENV['WAGN_READ_ONLY']
        config.allow_inline_styles   = false
        config.no_authentication     = false
        config.files_web_path        = 'files'
        config.cache_store           = :file_store, 'tmp/cache'
        
        config.recaptcha_public_key  = nil
        config.recaptcha_private_key = nil
        config.recaptcha_proxy       = nil
        
        config.email_defaults        = nil
        config.override_host         = nil
        config.override_protocol     = nil
        
        config.token_expiry          = 2.days
        
        config
      end
    end
    

    def paths
      @paths ||= begin
        paths = super
        add_wagn_path paths, "app",                 :eager_load => true, :glob => "*"
        add_wagn_path paths, "app/assets",          :glob => "*"
        add_wagn_path paths, "app/controllers",     :eager_load => true
        add_wagn_path paths, "lib/tasks",           :with => "lib/wagn/tasks", :glob => "**/*.rake"
        add_wagn_path paths, "config"               #TODO I'm not sure whether we have to keep this one
        #add_wagn_path paths, "config/environments", :glob => "#{Rails.env}.rb"
        #add_wagn_path paths, "config/initializers", :glob => "**/*.rb"
        add_wagn_path paths, "config/routes",       :with => "config/routes.rb"
        add_wagn_path paths, "db"
        add_wagn_path paths, "db/migrate"
        add_wagn_path paths, "db/migrate_cards"
        add_wagn_path paths, "db/seeds",            :with => "db/seeds.rb"        
        add_wagn_path paths, 'gem-mods',            :with => 'mods'
        add_wagn_path paths, 'gem-assets',          :with => 'public/assets'

        paths['app/models'] = []
        paths['app/mailers'] = []
        paths['app/views'] = File.join( Wagn.gem_root, 'lib/card' )
        paths['local-mods'] = approot_is_gemroot? ? [] : 'mods'        

        paths.add 'files'
        paths.add 'tmp/sets'
        paths.add 'tmp/set_patterns'
        
        paths
      end
    end

    def approot_is_gemroot?
      Wagn.gem_root.to_s == config.root.to_s
    end
    
    def add_wagn_path paths, path, options={}
      wagn_path        = File.join( Wagn.gem_root, path )
      options[:with] &&= File.join( Wagn.gem_root, options[:with]) 
      with = options[:with] || wagn_path
      paths[path] = Rails::Paths::Path.new(paths, wagn_path, with, options)
    end

    def load_tasks(app=self)
      super
      unless approot_is_gemroot?
        Rake::Task["db:schema:dump"].clear
      end
      self
    end
  end
end

