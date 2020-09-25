level = 0

def fac(n):
    print "{ action: 'push', line: 0, text:'fac(n=%d)' }," % (n);
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 1,    text:'   if %d <= 1'}," % (n)
    print "{ action: 'step' }," 
    if n <= 1:
        print "{ action: 'curline', line: 2,text: '      return 1'}," 
        print "{ action: 'step' }," 
        print "{ action: 'pop' }," 
        print "{ action: 'step' }," 
        return  1
    print "{ action: 'curline', line: 3, text:'   f = fac(%d-1)' }," % (n)
    print "{ action: 'step' }," 
    f = fac(n-1)
    print "{ action: 'line', line: 3,    text:'   f = %d' }," % (f)
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 4, text:'   f = %d * %d' }," % (f, n)
    f = f * n;
    print "{ action: 'step' }," 
    print "{ action: 'curline',  line: 5,text:'   return %d'}," % f;
    print "{ action: 'step' }," 
    print "{ action: 'pop' }," 
    return f


import random; 

if __name__ == "__main__":

    for n in [0, 1, 3, 5, 7]: 
       print "AboutAlgo[%d]  = { n: %d };"  % (n,n);
       print "AboutAlgo[%d].name = '%d Factorial';" % (n, n);

    for n in [0, 1, 3, 5, 7]: 
       print "AboutAlgo[%d].steps = [" % (n); 
       fac(n); 
       print "];"; 
       print "\n"; 



