#include <iostream>
#include <random>
const unsigned int SEED = 12345;
int main()
{
std::random_device device;
std::default_random_engine engine{device};
std::default_random_engine engine2{SEED};
std::uniform_int_distribution<int> distribution{1, 6}; //distribution
for (int i = 0; i < 1000; ++i)
{
std::cout << distribution(engine) << " ";
}
std::cout << std::endl;
return 0;
}