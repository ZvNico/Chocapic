#!/bin/bash

set -e

for letter in a b c d e f g h i j k l m n o p q r s t u v w x y z ; do
  cp -v /srv/hr/data/init.db /srv/hr/data/$letter.db
done
