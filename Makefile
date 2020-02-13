UUID=always-indicator@martin.zurowietz.de

default: clean zip

clean:
	find -name $(UUID).zip -delete

zip:
	cd $(UUID) && zip -r ../$(UUID).zip *

