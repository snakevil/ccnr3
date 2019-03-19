Http = require'resty.http'

{
    for: (url) ->
        http = Http.new!
        parts = [i[0] for i in ngx.re.gmatch http\parse_uri(url)[2], '[^\\.]+']
        require 'driver.' .. parts[#parts - 1] .. '_' .. parts[#parts]
}
