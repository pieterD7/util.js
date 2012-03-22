/**
 * 
 */

/*
 * For each pixel on the screen do:
{
  x0 = scaled x coordinate of pixel (must be scaled to lie somewhere in the interval (-2.5 to 1)
  y0 = scaled y coordinate of pixel (must be scaled to lie somewhere in the interval (-1, 1)

  x = 0
  y = 0

  iteration = 0
  max_iteration = 1000

  while ( x*x + y*y < 4  AND  iteration < max_iteration ) //Remember: 4 == (2*2)
  {
    xtemp = x*x - y*y + x0
    y = 2*x*y + y0

    x = xtemp

    iteration = iteration + 1
  }

  color = iteration

  plot(x0,y0,color)
}
 * 
 */