CCNR/3
===

Requirements
----

* opm get `sumory/lor`
* opm get `ledgetech/lua-resty-http`
* luarocks install `luafilesystem`

Install
----

1. chown www-data `var/db`
2. chown root `etc/cron.d/ccnr3-update-toc`
3. ln -s `etc/cron.d/ccnr3-update-toc` /etc/cron.d/
