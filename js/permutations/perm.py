import sys; 

code = [ 
"def permute(): ",
"    if (len(avail) == 0) : ",
"       print perm",
"       return",
"    for elem in avail: ",
"        perm.append(elem);",
"        avail.remove(elem); ",
"        permute() ",
"        avail.add(elem); ",
"        perm.pop()",
"    return" ]

avail = set();
perm = []; 

def permute(): 
   print "{ action: 'push', line: 0, text:'permute()' }," 
   print "{ action: 'step' }," 
   print "{ action: 'curline', line: 1,     text:'    if len(%s) <= 0:'}," % (str(avail))
   print "{ action: 'step' }," 
   if (len(avail) == 0): 
       print "/* %s */" % str(perm);
       print "{ action: 'curline', line: 2,  text:'        print %s' }," % (str(perm)) 
       print "{ action: 'printperm', perm: %s }," % (str(perm)) 
       print "{ action: 'step' }," 
       print "{ action: 'curline', line: 3,  text: '        return' },"
       print "{ action: 'step' }," 
       print "{ action: 'pop' }," 
       return;
   for elem in avail: 
       print "{ action: 'curline', line: 4,  text:'    for elem in %s'}," % (str(avail))
       print "{ action: 'localval', name: 'elem', value: %d}," % elem; 
       print "{ action: 'step' }," 
       perm.append(elem);
       print "{ action: 'curline', line: 5,    text:'        perm.append(%d)'}," % (elem)
       print "{ action: 'step' },"; 
       print "{ action: 'globalval', name: 'perm', val: %s }," % str(perm);
       print "{ action: 'curline', line: 6,    text:'        avail.remove(%d)'}," % (elem)
       print "{ action: 'step' },"; 
       avail.remove(elem); 
       print "{ action: 'globalval', name: 'avail', val: %s }," % str(list(avail))
       print "{ action: 'step' },"; 
       print "{ action: 'curline', line: 7,    text:'        permute()'}," 
       print "{ action: 'step' },"; 
       permute() 
       print "{ action: 'step' },"; 
       avail.add(elem); 
       print "{ action: 'curline', line: 8,    text:'        avail.add(%d)'}," % (elem)
       print "{ action: 'step' },"; 
       print "{ action: 'globalval', name: 'avail', val: %s }," % str(list(avail))
       print "{ action: 'step' },"; 
       perm.pop()
       print "{ action: 'curline', line: 9,    text:'        perm.pop()'},"  
       print "{ action: 'step' },"; 
       print "{ action: 'globalval', name: 'perm', val: %s }," % str(perm)
       print "{ action: 'step' },"; 
   print "{ action: 'curline', line:10, text: '    return' }," 
   print "{ action: 'step' },"; 
   print "{ action: 'pop' }," 
   return;

if __name__ == "__test__":

    n = int(sys.stdin.readline()); 
    print 'n %d\n' % n;

    avail = set();
    for i in range(n):
        avail.add(i) 
    perm = [];

    permute(avail, perm); 
    sys.exit(0); 

if __name__ == "__main__":
    if( 0): 
       print "AboutAlgo = [];\n"; 
       print "AboutAlgo.name = 'Computer All Permutations';\n";

       print "AboutAlgo.code =  %s;\n" % str(code); 
       print "\n";

       for n in [ 1, 2, 3, 4]: 
          print "AboutAlgo[%d]  = { n: %d };"  % (n,n);
          print "AboutAlgo[%d].name = 'permute(%d)';" % (n, n);

    for n in [ 1, 2, 3, 4]: 
       print "AboutAlgo[%d].steps = [" % (n); 
       avail = set();
       for i in range(n):
           avail.add(i) 
       perm = [];
       print "{ action: 'globalval', name: 'avail', val: %s }," % str(list(avail))
       print "{ action: 'globalval', name: 'perm', val: %s }," % str(perm)
       permute();
       print "];"; 
       print "\n"; 



