Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'games#index'
  post '/game', to: 'games#create'
  post '/answer', to: 'games#answer'
  post '/wager', to: 'games#wager'

  namespace :api do
  	namespace :v1 do
  		resources :categories
  		resources :clues
  		resources :users
  	end
  end

  mount ActionCable.server, at: '/cable'


end
