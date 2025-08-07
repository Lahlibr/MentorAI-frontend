// src/constants/languages.ts
export type Language = 'python' | 'java' | 'cpp' | 'javascript' | 'csharp';

export const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'csharp', label: 'C#' },
];

export const DEFAULT_CODE_TEMPLATES: Record<Language, string> = {
  python: `# Two Sum Solution
def two_sum(nums, target):
    # Write your solution here
    pass

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    target = int(input())
    result = two_sum(nums, target)
    print(result)
`,
  java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input and call solution
    }
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    // Read input and call solution
    return 0;
}`,
  javascript: `function twoSum(nums, target) {
  // Write your solution here
  return [];
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line);
  if (input.length === 2) {
    const nums = input[0].split(' ').map(Number);
    const target = Number(input[1]);
    console.log(twoSum(nums, target));
    rl.close();
  }
});`,
  csharp: `using System;
using System.Linq;

class Solution {
    public static int[] TwoSum(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }

    static void Main() {
        var nums = Console.ReadLine().Split().Select(int.Parse).ToArray();
        int target = int.Parse(Console.ReadLine());
        var result = TwoSum(nums, target);
        Console.WriteLine(string.Join(" ", result));
    }
}`
};
