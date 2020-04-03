
#if($contextDescription && $contextDescription != '')
			<!-- $contextDescription -->
#end
			<Context path="$contextPath" docBase="$contextDocBase" $!contextAdditionalAttributes>
				<Manager pathname="" />
#if($contextLoader && $contextLoader != '')
				$contextLoader
#end
#if($contextAdditionalElements && $contextAdditionalElements != '')
				$contextAdditionalElements
#end
#if($contextJarScanner && $contextJarScanner != '')
				$contextJarScanner
#end
			</Context>