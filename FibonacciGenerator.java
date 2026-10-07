import java.util.Iterator;

public class FibonacciGenerator implements Iterator<Long> {
    private int max;
    private int n = 0;
    private long a = 0;
    private long b = 1;

    FibonacciGenerator(int max) {
        this.max = max;
    }

    @Override
    public boolean hasNext() {
        return n < max;
    }

    @Override
    public Long next() {
        long x;
        if (n == 0)
            x = 0;
        else
            x = a + b;

        a = b;
        b = x;
        n++;
        return x;

    }
}
