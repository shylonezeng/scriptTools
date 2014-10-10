# Last argument is  Classname
# copy to origin file from temp file and romove temp one
if  ;then
fi

classname="Exampleclass"
for arg in "$@" 
do
	files=$(find -name $arg)
	if [ "$files" = "" ]; then
		continue;
        fi	
	#else deal with files one by one;
	for filename in $files 
	do
		touch "$filename".temp
		sed < $filename 's/\s*\(unsigned\|signed\)\?\(\s*void\|int\|char\|short\|long\|float\|double\)\(\(\s\|\*\)\+\)\([^):]*)\)$/\1\2\3'"$classname"'::\5/' > "$filename".temp
	cat "$filename".temp	
	done
	#end for loop	
done 
#	echo $arg  
# while do file in files
# 	find functon definition line
# 	locate add position
# 	add prefix to files 
# 	next file
# end
# 
#test result:
