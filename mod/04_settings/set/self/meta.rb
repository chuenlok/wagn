extend Card::Setting
setting_opts :group=>:communication, :position=>6, :rule_type_editable => true

view :raw do |args|
  %(
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>    
    #{ head_title     }
    #{ head_buttons     }
    #{ head_stylesheets }
    #{ head_javascript }      
  )
end