class Card
  def act opts={}
    # binding.pry if self.name == "another_voting_claim+*upvote_count"
    # puts self.name.green
    if DirectorRegister.act_card
      # if a card is not saved as a subcard by the "SuperDirector"
      # we restart from scratch
      # (otherwise if you call save! a second time on a card that has changed
      #  since the first save! call then the changes get lost because the old
      #  director will save the old version)
      # puts "\t#{DirectorRegister.act_card.name}".yellow
      if DirectorRegister.act_card != self && !only_storage_phase
        # binding.pry if self.name == "another voting claim+*vote count"
        # binding.pry if self.name == "another_voting_claim+*upvote_count"
        # if subcards.empty?
          director.unregister
          director.delete
          director
        # end
        self.only_storage_phase = true
      end
      main_act_block = false
    else
      DirectorRegister.clear
      self.director = nil
      DirectorRegister.act_card = self
      main_act_block = true
      if opts[:success]
        Env[:success] = Success.new(cardname, Env.params[:success])
      end
    end
    yield
  ensure
    DirectorRegister.clear if main_act_block
  end

  def self.new_director card, opts={}
    if opts[:parent]
      StageSubdirector.new card, opts
    elsif DirectorRegister.act_card &&
          DirectorRegister.act_card != card &&
          DirectorRegister.act_card.director.running?
      DirectorRegister.act_card.director.subdirectors.add(card)
    else
      StageDirector.new card
    end
  end

  class DirectorRegister
    cattr_accessor :act_card

    class << self
      def act_director
        return unless DirectorRegister.act_card
        DirectorRegister.act_card.director
      end

      def directors
        @directors ||= {}
      end

      def clear
        DirectorRegister.act_card = nil
        directors.each_pair do |card, _dir|
          card.director = nil
        end
        @directors = nil
      end

      def fetch card, opts={}
        return directors[card] if directors[card]
        directors.each_key do |dir_card|
          return dir_card.director if dir_card.name == card.name
        end
        directors[card] = Card.new_director card, opts
      end

      def add director
        directors[director.card] = director
      end

      def delete director
        return unless @directors
        @directors.delete director.card
        director.delete
      end

      def deep_delete director
        director.subdirectors.each do |subdir|
          deep_delete subdir
        end
        delete director
      end

      def running_act?
        (dir = DirectorRegister.act_director) && dir.running?
      end

      def to_s
        directors.values.map(&:to_s).join "\n"
      end
    end
  end
end
