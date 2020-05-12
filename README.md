# SAP Commerce Cloud Sample Repository

This sample repository contains the files and folders that are required to set up SAP Commerce Cloud. There are multiple branches covering different scenarios for Commerce Cloud (e.g. project Spartacus, data hub, solr customizations).  You can clone/download this repository, checkout the branch of interest and then follow the instructions in the readme to update the example files with your specific details. 

When your files are ready, push them to your SAP Commerce Cloud repository.  

# Requirements

- You have a public-facing code repository.
- You have an active SAP Commerce Cloud subscription.
- You have a license for SAP Commerce version 1808 or higher.
- You have not set up SAP Commerce Cloud yet.

# Supported Versions

You can find the supported SAP Commerce versions listed in the [Compatibility help topic](https://help.sap.com/viewer/1be46286b36a4aa48205be5a96240672/SHIP/en-US/31ac209eb08f41bc92e9bbe5772fb949.html).

# Download and Installation
Not applicable.

# Configuration

These instructions walk you through the process of cloning the repository and then updating the sample files with your specific requirements. 

The following folders and files are included in the sample repository.

Root level 
- core-customize folder: The folder that contains all of the folders and files that support Commerce Cloud.

core-customize folder
- manifest.json: The Commerce Cloud manifest.json file, which defines how your code will be built and deployed in the Public Cloud environments. The manifest is set up to leverage [configuration reuse](https://help.sap.com/viewer/1be46286b36a4aa48205be5a96240672/SHIP/en-US/2311d89eef9344fc81ef168ac9668307.html) to better allow for consistency between local and cloud builds.
- hybris folder: contains a sample custom folder for storing any custom extensions as well as the config folder for storing local and cloud properties, localextensions.xml and any local solr/tomcat configurations
- other sample manifests: A collection of tested and verified manifest files that you can use as starting points for your Commerce Cloud environments.

### Clone Repository

Clone the sample repository ([instructions can be found here](https://help.github.com/articles/cloning-a-repository/)). The files are copied to your local machine.

### Update the Custom Extensions

1. If you don’t have custom extensions, you can delete the kiwi & tiger sample folders. If you wish to use these extensions you'll have to uncomment them in your hybris/config/localextensions.xml folder
2. List any extensions you're using (custom and any from Commerce runtime) in the core-customize/hybris/config/localextensions.xml file
3. If you have custom extensions with dependencies, list the source extension first, then the dependent extension. Extensions are built in the order in which they appear in your localextension.xml and manifest.json files

### Update the Commerce Cloud manifest.json

1. Open the manifest.json file inside the core-customize folder. 
2. Update the “version” with the version of SAP Commerce that you plan to use. Refer to the Supported Versions section of this readme for more information.
3. Save the changes.

### Prepare to Push the Sample Repository
 
In the sample repository, verify that you have the following files in the core-customize folder.
 - manifest.json:  This is the manifest.json for Commerce Cloud.
 
### Push the Commerce Cloud Configuration to Code Repository

Push all the contents from your local machine to the root level of your Commerce Cloud repository.

### Access the Cloud Portal

Log in to the Cloud Portal and verify that your code repository is connected.

1. From a supported browser, log in to https://portal.commerce.ondemand.com. For more information, see [Accessing the Cloud Portal](https://help.sap.com/viewer/0c2050f6d31f49ddb6eba18509060ae5/SHIP/en-US/bc745004669445478d0c0505d77e096c.html).
2. Select *Repository* and verify that you are connected to the correct code repository.
3. Find the environments that were provisioned for your subscription.
3. Create a new build.
4. Deploy the build to the environment using the *Initialze Database* option.

You may also wish to see [this video](https://enable.cx.sap.com/playlist/dedicated/116161351/1_6tm85g61/1_df6ptanl) which provides a walkthrough of how to connect your repository, as well as [this video](https://enable.cx.sap.com/playlist/dedicated/116161351/1_6tm85g61/1_9ogbv7hz) which outlines how to build and deploy

### Final Steps - Validating an example Electronics Storefront and Javascript Storefront

Use the Cloud Portal to create a build and then deploy the build to an environment. 

1. After the build is deployed, you can find the 'Storefront' endpoint in the *Environments* page of the Cloud Portal listed under *Public Endpoints*.
2. Click on the *Storefront* hyperlink to access the details page for endpoint.
3. Either add an IP Filter Set for your IP address OR change the Base Rule from 'Deny All' to 'Allow All' in order to receive traffic to this example storefront.
4. Save the changes.
5. Click on the URL listed next to the *Storefront* public endpoint. You will receive a server error.
6. In your browser's address, append the endpoint address with */?site=electronics* and reload the page
7. Verify that you see a basic electronics storefront.

# Limitations

The repository must be a public-facing repository.  You cannot use a private repository to host SAP Commerce Cloud configurations. 

# Known Issues

There are no known issues at this time.

# How to Obtain Support

This repository is provided "as-is"; no support is available.

Find more information about SAP Commerce Cloud Setup on our [help site](https://help.sap.com/viewer/1be46286b36a4aa48205be5a96240672/SHIP/en-US/76450bc02bdf492689ca5e6d35c670e6.html).

# License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](https://github.wdf.sap.corp/staging-for-SAP-samples-public/cloud-commerce-sample-setup/blob/master/LICENSE).
