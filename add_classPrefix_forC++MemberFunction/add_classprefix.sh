## Last argument is  Classname
## copy to origin file from temp file and romove temp one


#search member function definition and add prefix class name

function add_prefix { #begin function
	
	
	#add class name for each member function in *.cpp  files
	for arg in "$@" 
	do
		files=$(find -name $arg)
		if [ "$files" = "" ]; then
			continue;
	        fi	
		#else deal with files one by one;
		for filename in $files 
		do
			temp_filename="$filename".temp
			touch $temp_filename
			sed < $filename 's/\s*\(unsigned\|signed\)\?\(\s*void\|int\|char\|short\|long\|float\|double\)\(\(\s\|\*\)\+\)\([^):]*)\)$/\1\2\3'"$classname"'::\5/' > $temp_filename
		#backup old file to undo delete and replace old file with renewed one	
		backup_file=`dirname $filename`/.`basename $filename`.backup
		echo $backup_file
		mv $filename $backup_file
		mv $temp_filename  $filename
		done
	
		#end for loop	
	done 
} #function end


#main entry
classname="Exampleclass"
echo -n "class name:"
read  classname;

while [ $classname = "" ] ; do 
	read classname ;
done
add_prefix $@
#end main
