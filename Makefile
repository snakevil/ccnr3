DESTDIR := var/app
MOONs := libexec/app.moon $(foreach dir, \
	$(shell 'find' lib -type d), \
	$(wildcard $(dir)/*.moon) \
)
LUAs := $(patsubst %.moon, $(DESTDIR)/%.lua, $(MOONs))

.PHONY: all clean lua

all: lua

clean:
	-$(RM) -r $(DESTDIR)/*

lua: $(LUAs)

$(LUAs): $(DESTDIR)/%.lua: %.moon
	@mkdir -p $(@D)
	moonc -p $^ > $@
