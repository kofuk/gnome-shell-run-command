SOURCES = extension.js metadata.json stylesheet.css

extension.zip: $(SOURCES)
	zip -j extension.zip $(SOURCES)

.PHONY: clean
clean:
	$(RM) extension.zip
