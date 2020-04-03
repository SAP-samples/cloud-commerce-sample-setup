
files from this directory will be copied to the embedded tomcat directory.
this allows you to overwrite the tomcat configuration or add keystores and other additional files.

variables (e.g. ${HYBRIS_BIN_DIR} or ${db.url}) in all configuration files (.properties/.xml/.sh/.bat) 
will get replaced during the copy process.


->implementation note: see the appserver_customdeployment macro in platform/resources/ant/util.xml for
details.