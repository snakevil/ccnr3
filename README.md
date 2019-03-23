CCNR/3
===

Requirements
----

* opm get `sumory/lor`
* opm get `ledgetech/lua-resty-http`
* luarocks install `luafilesystem`

Install
----

1. mkdir `app/db`
2. chown www-data `app/db`
3. chown root `app/etc/cron.d/ccnr3-update-toc`
4. ln -s `app/etc/cron.d/ccnr3-update-toc` /etc/cron.d/
