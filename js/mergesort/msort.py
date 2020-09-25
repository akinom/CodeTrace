level = 0

def merge(lst, left, middle, n):
    global level
    result = []
    i ,j = left, middle
    while (i < middle and j <  (left + n) ):
        if lst[i] <= lst[j]:
            result.append(lst[i])
            i += 1
        else:
            result.append(lst[j])
            j += 1
    while (i < middle): 
      result.append(lst[i]);  i=i+1
    while (j < left + n): 
      result.append(lst[j]); j = j + 1
    i = left
    j = 0
    while (i < left +n): 
        lst[i] = result[j]
        i = i + 1
        j = j + 1
    
def mergesort(lst, i, n):
    print "{ action: 'push', line: 0, text:'mergesort(lst, i=%d, n=%d)' }" % (i,n);
    print "{ action: 'setRange', i:%d, n:%d }" % (i,n);
    print "{ action: 'step' }" 
    print "{ action: 'curline', line: 1, text:'   if %d <= 1'}" % (n)
    print "{ action: 'step' }" 
    if n <= 1:
        print "{ action: 'curline', line: 2, text: '      return'}" 
        print "{ action: 'step' }" 
        print "{ action: 'setSortedSlice',  i:%d, n:%d, array: %s }" % (i, n, str(lst[i:i+n]));
        print "{ action: 'pop' }" 
        return 
    halflen = int( n / 2 )
    print "{ action: 'curline', line:3, text: '   halflen = %d'}" % (halflen)
    print "{ action: 'step' }" 
    print "{ action: 'curline', line: 4, text:'   mergesort(lst, %d, %d)' }" % (i,  halflen)
    print "{ action: 'step' }" 
    mergesort(lst, i,  halflen)
    print "{ action: 'step' }" 
    print "{ action: 'curline', line: 5, text:'   mergesort(lst, %d, %d)' }" % ( i+ halflen, n - halflen)
    print "{ action: 'step' }" 
    mergesort(lst, i + halflen, n - halflen)
    print "{ action: 'step' }" 
    print "{ action: 'curline', line: 6, text :'   merge(lst, left=%d, middle=%d, len=%d)' }" % (i, i + halflen, n)
    print "{ action: 'step' }" 
    merge(lst, i, i + halflen, n)
    print "{ action: 'setSortedSlice',  i:%d, n:%d, array: %s }" % (i, n, str(lst[i:i+n]));
    print "{ action: 'step' }"; 
    print "{ action: 'curline',  line: 7, text : '   return'}";
    print "{ action: 'step' }"; 
    print "{ action: 'pop' }" 
    return


import random; 

if __name__ == "__main__":
    lst = [3, 4, 8, 0, 6, 7, 4, 2, 1, 9, 4, 5]
    lst = [8, 4, 3, 15, 6, 12, 1];

    lst = [];
    n = 25; 
    for i in range(n):
       lst.append(random.randint(0, 100) ); 

    print "MergeSort[R25] = %s" % str(lst); 
    print "MergeSort[R25].steps = ["; 
    mergesort(lst, 0, len(lst))
    print "];"; 

