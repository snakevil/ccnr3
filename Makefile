DESTDIR := var
LUADIR := $(DESTDIR)/app
DIST := dist-$(shell 'date' +'%y%m%d%H%I').tar.xz
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
	tar -cf - -C $(DESTDIR) --exclude '.*' app gui | xz -9 > $@

lua: $(LUAs)
$(LUAs): $(LUADIR)/%.lua: %.moon
	@mkdir -p $(@D)
	moonc -p $^ > $@

$(RESs): $(LUADIR)/%: %
	@mkdir -p $(@D)
	'cp' -f $^ $@
