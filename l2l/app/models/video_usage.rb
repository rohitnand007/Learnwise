class VideoUsage
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :user_id, type: Integer
  field :topic_id, type: String
  field :video_id, type: String
  field :duration, type: Integer
  field :watched_data, type: Hash

  before_save :set_cumulative_data

  def response_data
      {
        watched_raw_data: watched_data['raw_data'],
        watched_cumulative_data: watched_data['cumulative_data'],
        completed_percent: completed_percent
      }
  end

  def set_cumulative_data
    cumulative_data = cumulative_watched_data watched_data['raw_data']
    watched_data['cumulative_data'] = cumulative_data
  end

  private
  def completed_percent
    total_time_watched = 0
    watched_data['cumulative_data'].each do |w|
      total_time_watched += w[1] - w[0] +1
    end
    (total_time_watched/(duration*1.0))*100
  end

  def cumulative_watched_data watched
    puts "Watched"
    print watched_data
    puts ""
    completed_discrete_durations = []
    watched.each do |interval|
      puts "interval"
      print interval
      puts ""
      start_time = interval[0]
      end_time = interval[1]
      interval_updated = false
      completed_discrete_durations.map! do |d_interval|
        puts "d_interval"
        print d_interval
        puts ""
        d_i_start_time = d_interval[0]
        d_i_end_time = d_interval[1]
        if d_i_end_time < start_time
          # non overlapping
          puts "non overlapping 1"
          [d_i_start_time, d_i_end_time]
        elsif d_i_start_time > end_time
          # non overlapping
          puts "non overlapping 2"
          [d_i_start_time, d_i_end_time]
        elsif d_i_start_time >= start_time && d_i_end_time <= end_time
          # sub interval
          puts "sub interval 1"
          interval_updated = true
          [start_time, end_time]
        elsif d_i_start_time <= start_time && d_i_end_time >= end_time
          # sub interval
          puts "sub interval 2"
          interval_updated = true
          [d_i_start_time, d_i_end_time]
        elsif d_i_start_time <= start_time && d_i_end_time <= end_time
          # Overlapping
          puts "Overlapping 1"
          interval_updated = true
          [d_i_start_time, end_time]
        elsif d_i_start_time >= start_time && d_i_end_time >= end_time
          # Overlapping
          puts "Overlapping 2"
          interval_updated = true
          [start_time, d_i_end_time]
        else
          puts "something missing"
        end
      end
      completed_discrete_durations << interval unless interval_updated
      puts " Before sort"
      print completed_discrete_durations
      puts ""
      completed_discrete_durations.sort! do |x, y|
        # Sorting by start times ascending
        case
        when x[0] < y[0]
          -1
        when x[0] > y[0]
          1
        else
          0
        end
      end
      temp = []
      (0..(completed_discrete_durations.length-1)).each do |i|
        if i==0
          temp << completed_discrete_durations[i]
          next
        end
        if completed_discrete_durations[i-1][0] == completed_discrete_durations[i][0]
          temp << [completed_discrete_durations[i][0], [completed_discrete_durations[i-1][1], completed_discrete_durations[i][1]].max ]
        elsif completed_discrete_durations[i-1][1] == completed_discrete_durations[i][0]
          temp << [completed_discrete_durations[i-1][0], completed_discrete_durations[i][1]]
        else
          temp << [completed_discrete_durations[i][0], completed_discrete_durations[i][1]]
        end
      end
      completed_discrete_durations = temp
      puts " After sort"
      print completed_discrete_durations
      puts ""
      temp = []
      (0..(completed_discrete_durations.length-1)).each do |i|
        if i==0
          temp << completed_discrete_durations[i]
          next
        end
        next if is_sub_interval(completed_discrete_durations[i], temp[-1])
        if (temp[-1][0] == completed_discrete_durations[i][0]) 
          # same starting
          temp[-1][1] = [temp[-1][1], completed_discrete_durations[i][1]].max
        elsif (temp[-1][1] == completed_discrete_durations[i][1])
          # same ending
          temp[-1][0] = [temp[-1][0], completed_discrete_durations[i][0]].min
        elsif temp[-1][1] == completed_discrete_durations[i][0]
          # end time of first = start time of now
          temp[-1][1] = completed_discrete_durations[i][1]
        else
          # non intersecting
          temp << [completed_discrete_durations[i][0], completed_discrete_durations[i][1]]
        end
      end
      completed_discrete_durations = temp
    end
    completed_discrete_durations
  end

  def is_sub_interval a, b
    # a is sub of b??
    if a[0] >= b[0] && a[1] <= b[1]
      true
    else
      false
    end
  end
end
# a = [[1,2], [3,5], [2,6]]
# b = cumulative_data a
# completed_discrete_durations = [[1,5],[1,3], [3,4]]
