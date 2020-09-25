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
    print "{ action: 'push', line: 0, text:'mergesort(lst, i=%d, n=%d)' }," % (i,n);
    print "{ action: 'setRange', i:%d, n:%d }," % (i,n);
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 1, text:'   if %d <= 1'}," % (n)
    print "{ action: 'step' }," 
    if n <= 1:
        print "{ action: 'curline', line: 2, text: '      return'}," 
        print "{ action: 'step' }," 
        print "{ action: 'setSortedSlice',  i:%d, n:%d, array: %s }," % (i, n, str(lst[i:i+n]));
        print "{ action: 'pop' }," 
        return 
    print "{ action: 'curline', line: 3, text:'   if %d <= 2'}," % (n)
    print "{ action: 'step' }," 
    if n <= 2:
       print "{ action: 'curline', line: 4, text:'      if lst[%d] > lst[%d+1]'}," % (i,i)
       print "{ action: 'step' }," 
       if lst[i] > lst[i+1]:
            print "{ action: 'curline', line: 5, text:'           swap(%d,%d+1)'}," % (i,i)
            print "{ action: 'step' }," 
            swap = lst[i] 
            lst[i] = lst[i+1]; 
            lst[i+1] = swap;
       print "{ action: 'curline', line: 6, text: '      return'}," 
       print "{ action: 'step' }," 
       print "{ action: 'setSortedSlice',  i:%d, n:%d, array: %s }," % (i, n, str(lst[i:i+n]));
       print "{ action: 'pop' }," 
       return 
    halflen = int( n / 2 )
    print "{ action: 'curline', line:7, text: '   halflen = %d'}," % (halflen)
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 8, text:'   mergesort(lst, %d, %d)' }," % (i,  halflen)
    print "{ action: 'step' }," 
    mergesort(lst, i,  halflen)
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 9, text:'   mergesort(lst, %d, %d)' }," % ( i+ halflen, n - halflen)
    print "{ action: 'step' }," 
    mergesort(lst, i + halflen, n - halflen)
    print "{ action: 'step' }," 
    print "{ action: 'curline', line: 10, text :'   merge(lst, left=%d, middle=%d, len=%d)' }," % (i, i + halflen, n)
    print "{ action: 'step' }," 
    merge(lst, i, i + halflen, n)
    print "{ action: 'setSortedSlice',  i:%d, n:%d, array: %s }," % (i, n, str(lst[i:i+n]));
    print "{ action: 'step' },"; 
    print "{ action: 'curline',  line: 11, text : '   return'},";
    print "{ action: 'step' },"; 
    print "{ action: 'pop' }," 
    return


import random; 

if __name__ == "__main__":
    lst = [3, 4, 8, 0, 6, 7, 4, 2, 1, 9, 4, 5]

    lst = [];
    n = 25; 
    for i in range(n):
       lst.append(random.randint(0, 100) ); 


    lst = [51, 66, 69, 33, 8, 95, 1, 96, 100, 22, 29, 4, 72, 21, 100, 71, 19, 55, 70, 86, 10, 91, 74, 28, 12, 57, 36, 95, 48, 63, 23, 53, 78, 94, 100, 52, 41, 92, 86, 64, 91, 90, 16, 85, 6, 70, 38, 72, 78, 75];
    lst = [15, 80, 7, 1, 55, 25, 23, 72, 9, 98, 47, 70, 12, 100, 91, 72, 96, 45, 20, 36, 70, 94, 37, 25, 53]
    lst = [8, 4, 3, 15, 6, 12, 1];
    print "MergeSortV2[R25].lst = %s" % str(lst); 
    print "MergeSortV2[R25].steps = ["; 
    mergesort(lst, 0, len(lst))
    print "];"; 

