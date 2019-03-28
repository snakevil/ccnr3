DESTDIR := var/build
LUADIR := $(DESTDIR)
DIST := ccnr3-$(shell 'date' +'%y%m%d%H%I').tar.xz
MOONs := libexec/app.moon $(foreach dir, \
	$(shell 'find' lib -type d), \
	$(wildcard $(dir)/*.moon) \
)
LUAs := $(patsubst %.moon, $(LUADIR)/%.lua, $(MOONs))
ASTs := etc/nginx/sites-available/ccnr3.sub \
	$(wildcard etc/cron.d/*) \
	$(wildcard sbin/*) \
	$(wildcard share/cron/*)
RESs := $(patsubst %, $(LUADIR)/%, $(ASTs))

.PHONY: all clean dist lua

all: lua

clean:
	-$(RM) -r $(DESTDIR)/*.tar.xz
	-$(RM) -r $(LUADIR)/*

dist: $(DESTDIR)/$(DIST)
$(DESTDIR)/$(DIST): $(LUAs) $(RESs)
	cd $(DESTDIR) && tar -cf - --exclude '.*' * | xz -9 > $(DIST)

lua: $(LUAs)
$(LUAs): $(LUADIR)/%.lua: %.moon
	@mkdir -p $(@D)
	moonc -p $^ > $@

$(RESs): $(LUADIR)/%: %
	@mkdir -p $(@D)
	'cp' -f $^ $@
