import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class Main {

  public class Point {

    public int x;
    public int y;

    public Point(int x, int y) {
      this.x = x;
      this.y = y;
    }
  }

  public enum Pipe {
    NS('|'),
    EW('-'),
    NE('L'),
    NW('J'),
    SE('F'),
    SW('7'),
    Start('S'),
    Empty('.');

    private char value;

    Pipe(char value) {
      this.value = value;
    }

    public static Pipe fromChar(char c) {
      for (Pipe pipe : Pipe.values()) {
        if (pipe.value == c) return pipe;
      }
      throw new RuntimeException("No pipe found");
    }

  }

  public enum Position {
    Top,
    Right,
    Bottom,
    Left
  }

  public class Map {

    private List<List<Pipe>> map;

    public Map() {
      this.map = new ArrayList<>();
    }

    public Map(Map map) {
      this.map = new ArrayList<>();
      for (List<Pipe> line : map.map) {
        List<Pipe> newLine = new ArrayList<>();
        for (Pipe pipe : line) {
          newLine.add(pipe);
        }
        this.map.add(newLine);
      }
    }

    public void set(int x, int y, Pipe pipe) {
      map.get(y).set(x, pipe);
    }

    public void push(List<Pipe> line) {
      map.add(line);
    }

    public List<Pipe> get(int index) {
      return map.get(index);
    }

    public int size() {
      return map.size();
    }
  }

  public Main() {}

  public static void main(String[] args) {
    String input = "";

    try {
      input = new String(Files.readAllBytes(Paths.get("data/input")));
    } catch (IOException e) {
      e.printStackTrace();
    }
    
    Main main = new Main();

    Map map = main.loadData(input);

    int result = main.calculateResult(map);

    System.out.println(result);
  }

  public Map loadData(String input) {
    String[] lines = input.split("\n");

    Map map = new Map();
    for (String line : lines) {
      List<Pipe> pipes = new ArrayList<>();
      for (char c : line.toCharArray()) {
        pipes.add(Pipe.fromChar(c));
      }
      map.push(pipes);
    }

    return map;
  }

  public int calculateResult(Map data) {
    Map map = new Map(data);

    List<Point> visited = new ArrayList<>();

    Point start = findStart(data);
    List<Point> loopStarts = findLoopStarts(map, start);
    Point firstLoopStart = loopStarts.get(0);

    Point previous = start;
    Point current = firstLoopStart;

    visited.add(previous);
    visited.add(current);

    while (current.x != start.x || current.y != start.y) {
      Point next = getNext(map, previous, current);
      visited.add(next);
      previous = current;
      current = next;
    }

    double area = this.lacet(visited);
    int pick = (int) Math.ceil(area - visited.size() / 2.0 + 1);

    return pick;
  }

  public double lacet(List<Point> path) {
    double res = 0;
    for (int i = 0; i < path.size(); i++) {
      Point pointA = path.get(i);
      Point pointB = path.get((i + 1) % path.size());
      res += pointA.x * pointB.y - pointB.x * pointA.y;
    }
    return Math.abs(res) / 2;
  }

  public Point findStart(Map map) {
    Point start = null;

    for (int y = 0; y < map.size(); y++) {
      List<Pipe> line = map.get(y);
      for (int x = 0; x < line.size(); x++) {
        Pipe pipe = line.get(x);
        if (pipe == Pipe.Start) {
          start = new Point(x, y);
          break;
        }
      }
    }

    if (start == null) {
      throw new RuntimeException("No start found");
    }

    return start;
  }

  public List<Point> findLoopStarts(Map map, Point start) {
    if (map.get(start.y).get(start.x) != Pipe.Start) {
      throw new RuntimeException("Start is not a start");
    }

    List<Point> loops = new ArrayList<>();

    Pipe top = map.get(start.y - 1).get(start.x);
    Pipe right = map.get(start.y).get(start.x + 1);
    Pipe bottom = map.get(start.y + 1).get(start.x);
    Pipe left = map.get(start.y).get(start.x - 1);

    if (top == Pipe.NS || top == Pipe.SE || top == Pipe.SW) loops.add(
      new Point(start.x, start.y - 1)
    );

    if (right == Pipe.EW || right == Pipe.NW || right == Pipe.SW) loops.add(
      new Point(start.x + 1, start.y)
    );

    if (bottom == Pipe.NS || bottom == Pipe.NE || bottom == Pipe.NW) loops.add(
      new Point(start.x, start.y + 1)
    );

    if (left == Pipe.EW || left == Pipe.NE || left == Pipe.SE) loops.add(
      new Point(start.x - 1, start.y)
    );

    return loops;
  }

  public Position getPreviousPosition(Point previous, Point current) {
    if (previous.x == current.x && previous.y == current.y - 1) return Position.Top;
    if (previous.x == current.x && previous.y == current.y + 1) return Position.Bottom;
    if (previous.x == current.x - 1 && previous.y == current.y) return Position.Left;
    if (previous.x == current.x + 1 && previous.y == current.y) return Position.Right;

    throw new RuntimeException("No position found");
  }

  public Position getNextPosition(Pipe dir, Position pos) {
    if (dir == Pipe.NS) {
      if (pos == Position.Top) return Position.Bottom;
      if (pos == Position.Bottom) return Position.Top;
    }
    if (dir == Pipe.EW) {
      if (pos == Position.Left) return Position.Right;
      if (pos == Position.Right) return Position.Left;
    }
    if (dir == Pipe.NE) {
      if (pos == Position.Top) return Position.Right;
      if (pos == Position.Right) return Position.Top;
    }
    if (dir == Pipe.NW) {
      if (pos == Position.Top) return Position.Left;
      if (pos == Position.Left) return Position.Top;
    }
    if (dir == Pipe.SE) {
      if (pos == Position.Bottom) return Position.Right;
      if (pos == Position.Right) return Position.Bottom;
    }
    if (dir == Pipe.SW) {
      if (pos == Position.Bottom) return Position.Left;
      if (pos == Position.Left) return Position.Bottom;
    }

    throw new RuntimeException("No next position found");
  }

  public Point getNextPoint(Map map, Point current, Position pos) {
    if (pos == Position.Top) return new Point(current.x, current.y - 1);
    if (pos == Position.Right) return new Point(current.x + 1, current.y);
    if (pos == Position.Bottom) return new Point(current.x, current.y + 1);
    if (pos == Position.Left) return new Point(current.x - 1, current.y);

    throw new RuntimeException("No next point found");
  }

  public Position getNextDirection(Map map, Point previous, Point current) {
    Pipe currentPipe = map.get(current.y).get(current.x);

    Position previousPos = getPreviousPosition(previous, current);
    if (previousPos == null) throw new RuntimeException("No position found");

    if (currentPipe == Pipe.Empty) return null;

    Position nextPos = getNextPosition(currentPipe, previousPos);
    if (nextPos == null) throw new RuntimeException("No next position found");

    return nextPos;
  }

  public Point getNext(Map map, Point previous, Point current) {
    Position nextPos = getNextDirection(map, previous, current);
    Point nextPoint = getNextPoint(map, current, nextPos);

    return nextPoint;
  }
}
