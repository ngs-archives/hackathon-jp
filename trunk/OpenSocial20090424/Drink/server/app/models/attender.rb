class Attender < ActiveRecord::Base
  belongs_to :party

  def gender
    case (id = read_attribute(:gender))
    when 1
      "男性"
    when 2
      "女性"
    else
      id
    end
  end
end
