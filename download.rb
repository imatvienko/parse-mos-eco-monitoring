require 'open-uri'

#stations = %w(rogovo troitsk kapotnya golovacheva kozuhovskaya shabol spirid kazak biryulevo chayanova butlerova cheremushki gagrina marin gurevsk lyublino hamovniki kosino losinyj kojuhovo polyarnaya ostankino madi maslovka dolgoprud letnaya turist mgu kutuz_2 zelen_11 zelen_15 zelen_6 veshnyaki zvenigorod chura suhar scherbinka semenkovo salarevo proletarskiy guryanova)
stations = %w(rogovo troitsk kapotnya golovacheva kozuhovskaya shabol spirid kazak biryulevo chayanova butlerova cheremushki gagrina marin gurevsk lyublino hamovniki kosino kojuhovo polyarnaya ostankino madi maslovka dolgoprud letnaya turist mgu kutuz_2 zelen_11 zelen_15 zelen_6 veshnyaki zvenigorod chura suhar scherbinka semenkovo salarevo proletarskiy guryanova)
stations.each do |station|
  begin
    open("http://www.mosecom.ru/air/air-year/station/#{station}/table.html", "rb") do |input|
      File.open("#{Dir.pwd}/data_2014/#{station}.html", "wb") do |output|
        output.write(input.read)
      end
    end
  rescue Exception => e
    puts "ERROR for the station #{station}: #{e}"
  end
end

