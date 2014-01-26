require File.expand_path('../boot', __FILE__)

require 'wagn/all'

module <%= app_const_base %>
  class Application < Wagn::Application
    
    config.encoding = "utf-8"

    config.cache_store = :file_store
    
  end
end
