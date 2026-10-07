

public class FibonacciCalculator {
    public int calculate(int n) {
        return fib(n, 1, 0);
    }

    private int fib(int term, int val, int prev) {
        if (term == 0)
            return prev;
        return fib(term - 1, val + prev, val);

    }
}
