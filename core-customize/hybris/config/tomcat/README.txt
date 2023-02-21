Files from this directory will be copied to the embedded tomcat directory.
This allows you to overwrite the tomcat configuration or add keystores and other additional files.
Subdirectories in this directories should correspond to the subdirectories in the Tomcat server. For example,
conf directory here corresponds to the conf directory under $CATALINA_HOME in the deployment.

Variables (e.g. ${HYBRIS_BIN_DIR} or ${db.url}) in all configuration files (.properties/.xml/.sh/.bat)
will get replaced during the copy process.

IMPLEMENTATION NOTE: see the appserver_customdeployment macro in platform/resources/ant/util.xml for
details.
